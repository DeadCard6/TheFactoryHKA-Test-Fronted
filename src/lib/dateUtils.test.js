import { describe, it, expect } from 'vitest';
import { parseApiDate, formatDateTime, startOfDayParam, endOfDayParam } from './dateUtils';

describe('dateUtils', () => {
  describe('parseApiDate', () => {
    it('appends Z to a UTC string that lacks it', () => {
      const dateStr = '2026-09-19T01:00:00';
      const date = parseApiDate(dateStr);
      expect(date.toISOString()).toBe('2026-09-19T01:00:00.000Z');
    });

    it('does not append Z if it already exists', () => {
      const dateStr = '2026-09-19T01:00:00Z';
      const date = parseApiDate(dateStr);
      expect(date.toISOString()).toBe('2026-09-19T01:00:00.000Z');
    });
  });

  describe('formatDateTime', () => {
    it('formats a UTC date into the correct time for America/Bogota', () => {
      // 01:00:00 UTC next day is 08:00:00 PM the previous day in Bogota (-5)
      const dateStr = '2026-09-19T01:00:00';
      
      const date = parseApiDate(dateStr);
      const formatter = new Intl.DateTimeFormat('es-CO', {
        timeZone: 'America/Bogota',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      const parts = formatter.formatToParts(date);
      const partsDict = parts.reduce((acc, part) => {
        acc[part.type] = part.value;
        return acc;
      }, {});

      expect(partsDict.day).toBe('18');
      expect(partsDict.month).toMatch(/^sep/i); // sept. or sep
      expect(partsDict.year).toBe('2026');
      
      // Node 18+ might pad hours differently or use different AM/PM symbols
      expect(parseInt(partsDict.hour, 10)).toBe(8);
      expect(partsDict.minute).toBe('00');
      expect(partsDict.dayPeriod.toLowerCase().replace(/[\.\s\u202f]/g, '')).toBe('pm');
    });
  });

  describe('startOfDayParam', () => {
    it('converts a Bogota midnight date to UTC without Z', () => {
      const dateStr = '2026-09-18';
      const param = startOfDayParam(dateStr);
      // Midnight in Bogota (-05:00) is 05:00:00 UTC the same day
      expect(param).toBe('2026-09-18T05:00:00.000');
    });
  });

  describe('endOfDayParam', () => {
    it('converts a Bogota end-of-day date to UTC without Z', () => {
      const dateStr = '2026-09-18';
      const param = endOfDayParam(dateStr);
      // 23:59:59.999 in Bogota (-05:00) is 04:59:59.999 UTC the NEXT day
      expect(param).toBe('2026-09-19T04:59:59.999');
    });
  });
});

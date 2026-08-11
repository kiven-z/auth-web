import { describe, expect, it } from 'vitest';
import {
  filterIcons,
  iconNamesOf,
  normalizeIconCollectionKey,
  pageForIcon,
  paginateIcons,
  parseIconModelValue,
  type IconCollectionMap,
} from '@/components/ui/Icon/iconSelectModel';

const map: IconCollectionMap = {
  'ri:': ['home', 'user', 'settings', 'search', 'mail'],
  'ep:': ['plus', 'minus', 'edit'],
};

describe('normalizeIconCollectionKey', () => {
  it('maps ep variants to ep:', () => {
    expect(normalizeIconCollectionKey('ep')).toBe('ep:');
    expect(normalizeIconCollectionKey('ep:')).toBe('ep:');
  });

  it('maps everything else to ri:', () => {
    expect(normalizeIconCollectionKey('ri')).toBe('ri:');
    expect(normalizeIconCollectionKey('ri:')).toBe('ri:');
    expect(normalizeIconCollectionKey('fa')).toBe('ri:');
    expect(normalizeIconCollectionKey('')).toBe('ri:');
  });
});

describe('parseIconModelValue', () => {
  it('parses slash keys and normalizes collection', () => {
    expect(parseIconModelValue('ep/plus')).toEqual({ collection: 'ep:', iconName: 'plus' });
    expect(parseIconModelValue('ri/home')).toEqual({ collection: 'ri:', iconName: 'home' });
    expect(parseIconModelValue('fa/legacy')).toEqual({ collection: 'ri:', iconName: 'legacy' });
  });

  it('returns null when slash form is invalid', () => {
    expect(parseIconModelValue('')).toBeNull();
    expect(parseIconModelValue('noslash')).toBeNull();
    expect(parseIconModelValue('/only-name')).toBeNull();
  });
});

describe('iconNamesOf / filter / paginate / pageForIcon', () => {
  it('reads typed collection lists', () => {
    expect(iconNamesOf(map, 'ep:')).toEqual(['plus', 'minus', 'edit']);
  });

  it('filters and paginates', () => {
    expect(filterIcons(map['ri:'], 'sett')).toEqual(['settings']);
    expect(paginateIcons(map['ri:'], 1, 2)).toEqual(['home', 'user']);
    expect(paginateIcons(map['ri:'], 2, 2)).toEqual(['settings', 'search']);
  });

  it('resolves page for known icon and falls back to 1 when missing', () => {
    expect(pageForIcon(map['ri:'], 'settings', 2)).toBe(2);
    expect(pageForIcon(map['ri:'], 'missing', 2)).toBe(1);
  });
});

import {
  CalculationMethod,
  Madhab as AdhanMadhab,
  HighLatitudeRule as AdhanHighLatitudeRule,
} from 'adhan';
import type { AdhanMethod, Madhab as MosqueMadhab, HighLatitudeRule as MosqueHighLatitudeRule } from '@/shared/types';

export function getCalculationParams(method: AdhanMethod) {
  const factories: Record<AdhanMethod, () => ReturnType<typeof CalculationMethod.MuslimWorldLeague>> = {
    MuslimWorldLeague: () => CalculationMethod.MuslimWorldLeague(),
    Egyptian: () => CalculationMethod.Egyptian(),
    Karachi: () => CalculationMethod.Karachi(),
    UmmAlQura: () => CalculationMethod.UmmAlQura(),
    Dubai: () => CalculationMethod.Dubai(),
    Qatar: () => CalculationMethod.Qatar(),
    Kuwait: () => CalculationMethod.Kuwait(),
    MoonsightingCommittee: () => CalculationMethod.MoonsightingCommittee(),
    Singapore: () => CalculationMethod.Singapore(),
    Turkey: () => CalculationMethod.Turkey(),
    Tehran: () => CalculationMethod.Tehran(),
    NorthAmerica: () => CalculationMethod.NorthAmerica(),
  };
  return factories[method]();
}

export function getMadhab(madhab: MosqueMadhab): 'shafi' | 'hanafi' {
  const mapping: Record<MosqueMadhab, 'shafi' | 'hanafi'> = {
    Shafi: AdhanMadhab.Shafi,
    Hanafi: AdhanMadhab.Hanafi,
  };
  return mapping[madhab];
}

export function getHighLatitudeRule(rule: MosqueHighLatitudeRule): 'middleofthenight' | 'seventhofthenight' | 'twilightangle' {
  const mapping: Record<MosqueHighLatitudeRule, 'middleofthenight' | 'seventhofthenight' | 'twilightangle'> = {
    MiddleOfTheNight: AdhanHighLatitudeRule.MiddleOfTheNight,
    SeventhOfTheNight: AdhanHighLatitudeRule.SeventhOfTheNight,
    TwilightAngle: AdhanHighLatitudeRule.TwilightAngle,
  };
  return mapping[rule];
}

export function adhanMethodToAladhanId(method: AdhanMethod): number {
  const mapping: Record<AdhanMethod, number> = {
    MuslimWorldLeague: 3,
    Egyptian: 5,
    Karachi: 1,
    UmmAlQura: 4,
    Dubai: 16,
    Qatar: 10,
    Kuwait: 9,
    MoonsightingCommittee: 15,
    Singapore: 11,
    Turkey: 13,
    Tehran: 7,
    NorthAmerica: 2,
  };
  return mapping[method];
}

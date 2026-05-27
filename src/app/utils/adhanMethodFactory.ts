import {
  CalculationMethod,
  Madhab as AdhanMadhab,
  HighLatitudeRule as AdhanHighLatitudeRule,
} from 'adhan';
import type { AdhanMethod, Madhab as MosqueMadhab, HighLatitudeRule as MosqueHighLatitudeRule } from '@/app/types/mosqueConfig';

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
    MuslimWorldLeague: 1,
    Egyptian: 5,
    Karachi: 2,
    UmmAlQura: 4,
    Dubai: 12,
    Qatar: 11,
    Kuwait: 8,
    MoonsightingCommittee: 7,
    Singapore: 10,
    Turkey: 13,
    Tehran: 3,
    NorthAmerica: 15,
  };
  return mapping[method];
}

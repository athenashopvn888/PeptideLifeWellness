'use client';

import { useState, useMemo } from 'react';
import { Calculator, AlertTriangle } from 'lucide-react';

export default function PeptideCalculator() {
  const [vialAmount, setVialAmount] = useState('');
  const [liquidAdded, setLiquidAdded] = useState('');
  const [desiredAmount, setDesiredAmount] = useState('');
  const [syringeUnits, setSyringeUnits] = useState('100');

  const result = useMemo(() => {
    const vial = parseFloat(vialAmount);
    const liquid = parseFloat(liquidAdded);
    const desired = parseFloat(desiredAmount);
    const syringe = parseFloat(syringeUnits);

    if (!vial || !liquid || !desired || !syringe) return null;
    if (vial <= 0 || liquid <= 0 || desired <= 0 || syringe <= 0) return null;

    // concentration in mcg per mL
    const concentrationMcgPerMl = (vial * 1000) / liquid;
    // mL needed for desired mcg
    const mlNeeded = desired / concentrationMcgPerMl;
    // units on syringe
    const unitsNeeded = mlNeeded * syringe;

    return {
      concentrationMcgPerMl: concentrationMcgPerMl.toFixed(1),
      mlNeeded: mlNeeded.toFixed(4),
      unitsNeeded: unitsNeeded.toFixed(1),
    };
  }, [vialAmount, liquidAdded, desiredAmount, syringeUnits]);

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-border">
        <div className="space-y-5">
          <div>
            <label htmlFor="vial-amount" className="block text-sm font-medium text-navy mb-1.5">
              Vial Amount (mg)
            </label>
            <input
              id="vial-amount"
              type="number"
              step="0.1"
              min="0"
              value={vialAmount}
              onChange={(e) => setVialAmount(e.target.value)}
              placeholder="e.g. 5"
              className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue transition-colors"
            />
          </div>

          <div>
            <label htmlFor="liquid-added" className="block text-sm font-medium text-navy mb-1.5">
              Liquid Added (mL)
            </label>
            <input
              id="liquid-added"
              type="number"
              step="0.1"
              min="0"
              value={liquidAdded}
              onChange={(e) => setLiquidAdded(e.target.value)}
              placeholder="e.g. 2"
              className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue transition-colors"
            />
          </div>

          <div>
            <label htmlFor="desired-amount" className="block text-sm font-medium text-navy mb-1.5">
              Desired Amount (mcg)
            </label>
            <input
              id="desired-amount"
              type="number"
              step="1"
              min="0"
              value={desiredAmount}
              onChange={(e) => setDesiredAmount(e.target.value)}
              placeholder="e.g. 250"
              className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue transition-colors"
            />
          </div>

          <div>
            <label htmlFor="syringe-units" className="block text-sm font-medium text-navy mb-1.5">
              Syringe Unit Size
            </label>
            <select
              id="syringe-units"
              value={syringeUnits}
              onChange={(e) => setSyringeUnits(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue transition-colors bg-white"
            >
              <option value="100">100 units (1mL)</option>
              <option value="50">50 units (0.5mL)</option>
              <option value="30">30 units (0.3mL)</option>
            </select>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-6 space-y-3 animate-fade-in">
            <div className="bg-green-soft rounded-xl p-5">
              <p className="text-xs font-medium text-green mb-1">Estimated Units</p>
              <p className="text-3xl font-bold text-green">{result.unitsNeeded} <span className="text-lg">units</span></p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-soft rounded-xl p-4">
                <p className="text-xs font-medium text-blue mb-1">Concentration</p>
                <p className="text-lg font-bold text-navy">{result.concentrationMcgPerMl} <span className="text-xs text-gray">mcg/mL</span></p>
              </div>
              <div className="bg-silver rounded-xl p-4">
                <p className="text-xs font-medium text-gray mb-1">Volume Needed</p>
                <p className="text-lg font-bold text-navy">{result.mlNeeded} <span className="text-xs text-gray">mL</span></p>
              </div>
            </div>
          </div>
        )}

        {!result && (
          <div className="mt-6 bg-silver rounded-xl p-5 text-center">
            <Calculator size={24} className="text-gray-light mx-auto mb-2" />
            <p className="text-sm text-gray">Enter values above to see estimated results</p>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-relaxed">
          This calculator is for educational tracking purposes only and is not medical advice. Always confirm any health decisions with a licensed healthcare professional.
        </p>
      </div>
    </div>
  );
}

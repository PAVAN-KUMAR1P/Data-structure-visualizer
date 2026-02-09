
import React, { useState } from 'react';
import { ListOperation, DatasetType, ListKind } from '../../../types';

interface Props {
  onOperation: (op: ListOperation, value: string | number, index?: number) => void;
  isProcessing: boolean;
  datasetType: DatasetType;
  onDatasetTypeChange: (type: DatasetType) => void;
  listKind: ListKind;
  onListKindChange: (kind: ListKind) => void;
  customUI?: boolean;
}

const ControlPanel: React.FC<Props> = ({
  onOperation,
  isProcessing,
  datasetType,
  onDatasetTypeChange,
}) => {
  const [val, setVal] = useState<string>('');
  const [idx, setIdx] = useState<string>('');

  const handleOp = (op: ListOperation) => {
    const numIdx = parseInt(idx);
    const noValueOps: ListOperation[] = ['DELETE_HEAD', 'DELETE_TAIL', 'REVERSE', 'SORT', 'TRAVERSE', 'FIND_MIDDLE', 'CLEAR'];
    if (!val.trim() && !noValueOps.includes(op)) {
      if (op === 'INSERT_AT' && isNaN(numIdx)) return;
      if (op !== 'INSERT_AT') return;
    }
    const finalValue = datasetType === 'numbers' ? parseInt(val) : val;
    onOperation(op, finalValue, isNaN(numIdx) ? undefined : numIdx);
    if (['INSERT_HEAD', 'INSERT_TAIL', 'INSERT_AT'].includes(op)) setVal('');
    if (op === 'INSERT_AT') setIdx('');
  };

  // 🌿 Soft Mint Learning Theme - Section Header
  const SectionHeader = ({ title, icon }: { title: string, icon: string }) => (
    <div className="flex items-center gap-2 mb-3 mt-1">
      <span className="w-6 h-6 rounded-lg bg-mint-100 text-mint-600 flex items-center justify-center text-xs border border-mint-200">
        <i className={`fa-solid ${icon}`}></i>
      </span>
      <h3 className="text-xs font-bold text-deep-green uppercase tracking-wide font-mono">{title}</h3>
    </div>
  );

  // 🌿 Soft Mint Button Styles
  const btnBase = "rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-2 border uppercase tracking-wider";
  const primaryBtn = "bg-mint-100 border-mint-300 text-mint-700 hover:bg-mint-200 hover:border-mint-400 shadow-soft";
  const secondaryBtn = "bg-white border-slate-200 text-slate-600 hover:bg-mint-50 hover:text-mint-700 hover:border-mint-300 shadow-soft";
  const dangerBtn = "bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 shadow-soft";
  const accentBtn = "bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100 hover:border-sky-300 shadow-soft";

  return (
    <div className="space-y-6 animate-fade-in px-1">

      {/* Data Configuration */}
      <div className="bg-white p-3 rounded-xl border border-mint-200 shadow-soft">
        <label className="text-[10px] font-bold text-mint-600 uppercase tracking-wider mb-2 block font-mono">DATA TYPE</label>
        <div className="flex gap-2">
          {(['numbers', 'characters'] as DatasetType[]).map(t => (
            <button
              key={t}
              onClick={() => onDatasetTypeChange(t)}
              className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg uppercase transition-all ${datasetType === t ? 'bg-mint-400 text-white border border-mint-500 shadow-soft' : 'text-slate-500 bg-mint-50 border border-mint-200 hover:text-mint-700 hover:bg-mint-100'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* BUILD SECTION */}
      <div>
        <SectionHeader title="Construct" icon="fa-hammer" />
        <div className="bg-white p-3 rounded-2xl border border-mint-200 space-y-3 shadow-soft">
          <input
            type={datasetType === 'numbers' ? 'number' : 'text'}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Value..."
            className="w-full px-3 py-2 bg-mint-50 border border-mint-200 rounded-xl text-sm text-deep-green placeholder-slate-400 focus:outline-none focus:border-mint-400 focus:ring-2 focus:ring-mint-200 font-mono"
          />

          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => handleOp('INSERT_HEAD')} disabled={isProcessing || !val.trim()} className={`w-full py-2.5 ${btnBase} ${primaryBtn}`}>
              <i className="fa-solid fa-arrow-up"></i> Head
            </button>
            <button onClick={() => handleOp('INSERT_TAIL')} disabled={isProcessing || !val.trim()} className={`w-full py-2.5 ${btnBase} ${primaryBtn}`}>
              <i className="fa-solid fa-arrow-down"></i> Tail
            </button>
          </div>

          <div className="flex gap-2 border-t border-mint-100 pt-3 mt-1">
            <input
              type="number"
              value={idx}
              onChange={(e) => setIdx(e.target.value)}
              placeholder="#"
              className="w-16 px-2 py-2 bg-mint-50 border border-mint-200 rounded-xl text-xs text-center text-deep-green focus:outline-none focus:border-mint-400"
            />
            <button onClick={() => handleOp('INSERT_AT')} disabled={isProcessing || !val.trim() || !idx.trim()} className={`flex-1 ${btnBase} ${secondaryBtn}`}>
              <i className="fa-solid fa-plus"></i> At Index
            </button>
          </div>
        </div>
      </div>

      {/* MODIFY SECTION */}
      <div>
        <SectionHeader title="Modify" icon="fa-pen-to-square" />
        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => handleOp('DELETE_HEAD')} disabled={isProcessing} className={`py-2 ${btnBase} ${dangerBtn}`}>
            <i className="fa-solid fa-minus"></i> Del Head
          </button>
          <button onClick={() => handleOp('DELETE_TAIL')} disabled={isProcessing} className={`py-2 ${btnBase} ${dangerBtn}`}>
            <i className="fa-solid fa-minus"></i> Del Tail
          </button>
          <button onClick={() => handleOp('DELETE_VALUE')} disabled={isProcessing || !val.trim()} className={`col-span-2 py-2 ${btnBase} ${dangerBtn}`}>
            <i className="fa-solid fa-trash"></i> Delete Value '{val || '...'}'
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <button onClick={() => handleOp('REVERSE')} disabled={isProcessing} className={`py-2 ${btnBase} ${secondaryBtn}`}>
            <i className="fa-solid fa-shuffle"></i> Reverse
          </button>
          <button onClick={() => handleOp('SORT')} disabled={isProcessing} className={`py-2 ${btnBase} ${secondaryBtn}`}>
            <i className="fa-solid fa-arrow-down-az"></i> Sort
          </button>
        </div>

        <button onClick={() => handleOp('CLEAR')} disabled={isProcessing} className={`w-full mt-2 py-2 ${btnBase} ${secondaryBtn}`}>
          <i className="fa-solid fa-eraser"></i> Clear All
        </button>
      </div>

      {/* EXPLORE SECTION */}
      <div>
        <SectionHeader title="Traverse" icon="fa-compass" />
        <div className="space-y-2">
          <button onClick={() => handleOp('TRAVERSE')} disabled={isProcessing} className={`w-full py-2.5 ${btnBase} ${accentBtn}`}>
            <i className="fa-solid fa-arrows-turn-right"></i> Traverse All
          </button>
          
          <button onClick={() => handleOp('SEARCH')} disabled={isProcessing || !val.trim()} className={`w-full py-2.5 ${btnBase} bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-300 shadow-soft`}>
            <i className="fa-solid fa-magnifying-glass"></i> Search '{val || '...'}'
          </button>

          <button onClick={() => handleOp('FIND_MIDDLE')} disabled={isProcessing} className={`w-full py-2.5 ${btnBase} ${accentBtn}`}>
            <i className="fa-solid fa-crosshairs"></i> Find Middle
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;

import React, { useState, useEffect } from 'react';
import { useLearningStore } from '../../store/learningStore';
import { GlassCard } from '../../components/GlassCard';
import { ArrowRight, Sparkles, RefreshCw, Layers } from 'lucide-react';

interface VDomNode {
  id: string;
  type: string;
  props?: Record<string, unknown>;
  children?: VDomNode[];
  text?: string;
  diffStatus?: 'unchanged' | 'updated' | 'inserted' | 'deleted';
}

const PRESETS: Record<string, { name: string; desc: string; oldTree: VDomNode; newTree: VDomNode; patches: { id: string; text: string; speed: string }[] }> = {
  textChange: {
    name: 'Modify Node Text/Props',
    desc: 'React updates text nodes in place without dismantling the DOM structure. Very high performance.',
    oldTree: {
      id: 'root', type: 'div', props: { className: 'container' },
      children: [
        { id: 'title', type: 'h1', text: 'Welcome to React' },
        { id: 'sub', type: 'p', text: 'Visual simulations' }
      ]
    },
    newTree: {
      id: 'root', type: 'div', props: { className: 'container' },
      children: [
        { id: 'title', type: 'h1', text: 'EngineLab React Lab', diffStatus: 'updated' },
        { id: 'sub', type: 'p', text: 'Visual simulations' }
      ]
    },
    patches: [
      { id: 'op1', text: 'UPDATE_TEXT: Node #title ("Welcome to React" ➔ "EngineLab React Lab")', speed: 'Fast' }
    ]
  },
  typeChange: {
    name: 'Change Node Element Type',
    desc: 'Since element types differ (span ➔ p), React destroys the old subtree entirely and rebuilds the new element.',
    oldTree: {
      id: 'root', type: 'div',
      children: [
        {
          id: 'holder', type: 'span',
          children: [{ id: 'text1', type: 'code', text: 'Important Note' }]
        }
      ]
    },
    newTree: {
      id: 'root', type: 'div',
      children: [
        {
          id: 'holder', type: 'p', diffStatus: 'updated',
          children: [{ id: 'text1', type: 'code', text: 'Important Note', diffStatus: 'inserted' }]
        }
      ]
    },
    patches: [
      { id: 'op1', text: 'REMOVE_NODE: Destroy <span> (#holder) and all children.', speed: 'Expensive' },
      { id: 'op2', text: 'CREATE_NODE: Mount <p> (#holder).', speed: 'Neutral' },
      { id: 'op3', text: 'CREATE_NODE: Mount <code> (#text1).', speed: 'Neutral' }
    ]
  },
  listKeys: {
    name: 'List Reconciliation (Keys vs Index)',
    desc: 'Using stable keys allows React to match children across renders, shifting nodes rather than destroying them.',
    oldTree: {
      id: 'root', type: 'ul',
      children: [
        { id: 'itemA', type: 'li', text: 'Item A (key="A")' },
        { id: 'itemB', type: 'li', text: 'Item B (key="B")' }
      ]
    },
    newTree: {
      id: 'root', type: 'ul',
      children: [
        { id: 'itemB', type: 'li', text: 'Item B (key="B")', diffStatus: 'unchanged' },
        { id: 'itemA', type: 'li', text: 'Item A (key="A")', diffStatus: 'unchanged' }
      ]
    },
    patches: [
      { id: 'op1', text: 'MOVE_NODE: Swap places for #itemA and #itemB (Minimal DOM reorder).', speed: 'Fast' }
    ]
  },
  listNoKeys: {
    name: 'List Mismatch (No Keys / Index)',
    desc: 'Without keys, React compares children by index. It sees a mismatch at index 0 and re-renders both nodes.',
    oldTree: {
      id: 'root', type: 'ul',
      children: [
        { id: 'item0', type: 'li', text: 'Item A' },
        { id: 'item1', type: 'li', text: 'Item B' }
      ]
    },
    newTree: {
      id: 'root', type: 'ul',
      children: [
        { id: 'item0', type: 'li', text: 'Item B', diffStatus: 'updated' },
        { id: 'item1', type: 'li', text: 'Item A', diffStatus: 'updated' }
      ]
    },
    patches: [
      { id: 'op1', text: 'UPDATE_TEXT: Mutated Item at index 0 (A ➔ B).', speed: 'Expensive' },
      { id: 'op2', text: 'UPDATE_TEXT: Mutated Item at index 1 (B ➔ A).', speed: 'Expensive' }
    ]
  }
};

export const VirtualDomDiffing: React.FC = () => {
  const { addLog } = useLearningStore();
  const [activePreset, setActivePreset] = useState<keyof typeof PRESETS>('textChange');
  const [isDiffing, setIsDiffing] = useState(false);

  const preset = PRESETS[activePreset];

  useEffect(() => {
    addLog(`VDOM Loaded Preset: ${preset.name}`, 'system');
  }, [activePreset, addLog, preset.name]);

  const handleDiff = () => {
    setIsDiffing(true);
    addLog('Executing VDOM Reconciliation algorithm...', 'info');
    preset.patches.forEach((p, i) => {
      setTimeout(() => {
        addLog(`DOM Operation Generated: ${p.text}`, p.speed === 'Expensive' ? 'warn' : 'success');
      }, (i + 1) * 600);
    });
  };

  const renderNodeVisual = (node: VDomNode, isNewTree: boolean) => {
    let cardStyle = 'border-zinc-800 bg-zinc-900/40 text-zinc-300';
    
    if (isNewTree && isDiffing) {
      if (node.diffStatus === 'updated') {
        cardStyle = 'border-amber-500/50 bg-amber-500/10 text-amber-200 glow-warning';
      } else if (node.diffStatus === 'inserted') {
        cardStyle = 'border-success/50 bg-success/10 text-emerald-200 glow-success';
      } else if (node.diffStatus === 'deleted') {
        cardStyle = 'border-danger/50 bg-danger/10 text-rose-200 line-through glow-danger';
      }
    }

    return (
      <div 
        key={node.id} 
        className="flex flex-col items-center select-none"
      >
        <div className={`px-3 py-2 border rounded-lg font-mono text-[11px] flex flex-col items-center min-w-[100px] shadow-lg transition-all duration-300 ${cardStyle}`}>
          <span className="font-bold text-zinc-100 flex items-center gap-1">
            &lt;{node.type}&gt;
          </span>
          <span className="text-[10px] text-zinc-500 font-medium">#{node.id}</span>
          {node.text && (
            <span className="mt-1 text-[10px] bg-black/35 px-1.5 py-0.5 rounded text-zinc-400 overflow-hidden text-ellipsis max-w-[120px] whitespace-nowrap">
              {node.text}
            </span>
          )}
        </div>
        
        {/* Render child connections recursively */}
        {node.children && node.children.length > 0 && (
          <div className="flex gap-4 mt-6 relative pt-4">
            {/* SVG Connecting lines */}
            <div className="absolute top-0 left-0 w-full h-4 flex justify-around">
              {node.children.map((child, i) => (
                <div key={child.id + i} className="w-0.5 bg-zinc-800 h-full" />
              ))}
            </div>
            {node.children.map((child) => renderNodeVisual(child, isNewTree))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-[500px]">
      
      {/* Settings & Info (LHS) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <GlassCard title="Reconciliation Presets">
          <div className="space-y-2">
            {Object.keys(PRESETS).map((key) => {
              const item = PRESETS[key as keyof typeof PRESETS];
              return (
                <button
                  key={key}
                  onClick={() => {
                    setActivePreset(key as keyof typeof PRESETS);
                    setIsDiffing(false);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-left text-xs font-semibold tracking-wide border transition-all ${
                    activePreset === key
                      ? 'bg-primary/20 border-primary text-zinc-100 glow-indigo'
                      : 'bg-zinc-900/50 border-zinc-850 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Layers size={14} className={activePreset === key ? 'text-primary' : 'text-zinc-600'} />
                    {item.name}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 border-t border-zinc-800 pt-4 space-y-4 select-text">
            <h4 className="text-xs font-bold text-zinc-400 tracking-wider">PRESET INSIGHT</h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              {preset.desc}
            </p>
            
            <button
              onClick={handleDiff}
              className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg flex items-center justify-center gap-2 text-xs font-bold shadow-lg transition-all"
            >
              <RefreshCw size={14} className={isDiffing ? 'animate-spin' : ''} />
              Reconcile & Diff Trees
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Visual Tree Canvas (RHS) */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <GlassCard title="Tree Diffing Sandbox Canvas">
          <div className="flex-1 flex flex-col md:flex-row items-center justify-around gap-8 py-8 min-h-[300px]">
            
            {/* Old VDOM */}
            <div className="flex flex-col items-center bg-black/40 border border-zinc-900 p-6 rounded-xl flex-1 max-w-[340px] h-full shadow-inner relative">
              <span className="text-[10px] text-zinc-500 font-bold absolute top-3 left-4 tracking-wider select-none">
                OLD VIRTUAL DOM TREE
              </span>
              <div className="mt-6">
                {renderNodeVisual(preset.oldTree, false)}
              </div>
            </div>

            {/* Reconciliation Indicator arrow */}
            <div className="flex flex-col items-center gap-2 select-none">
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center shadow-lg">
                <ArrowRight className="text-zinc-500" />
              </div>
              <span className="text-[10px] text-zinc-500 font-mono tracking-widest font-bold">DIFF</span>
            </div>

            {/* New VDOM */}
            <div className="flex flex-col items-center bg-black/40 border border-zinc-900 p-6 rounded-xl flex-1 max-w-[340px] h-full shadow-inner relative">
              <span className="text-[10px] text-zinc-500 font-bold absolute top-3 left-4 tracking-wider select-none">
                NEW VIRTUAL DOM TREE
              </span>
              <div className="mt-6">
                {renderNodeVisual(preset.newTree, true)}
              </div>
            </div>

          </div>

          {/* DOM Operation Output Sheet */}
          <div className="border-t border-zinc-800 pt-4">
            <div className="text-xs text-zinc-400 font-bold mb-2 tracking-wider flex items-center gap-1.5 select-none">
              <Sparkles size={14} className="text-amber-500" />
              GENERATED DOM OPERATIONS PATCH
            </div>
            
            <div className="bg-[#09090b] border border-zinc-900 rounded-lg p-3 font-mono text-xs flex flex-col gap-2 min-h-[60px] max-h-[140px] overflow-y-auto">
              {!isDiffing ? (
                <span className="text-zinc-700 italic select-none">Click &quot;Reconcile &amp; Diff Trees&quot; to see DOM updates...</span>
              ) : (
                preset.patches.map((patch) => (
                  <div key={patch.id} className="flex justify-between items-center bg-zinc-950 border border-zinc-900 px-3 py-1.5 rounded">
                    <span className="text-zinc-300">{patch.text}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      patch.speed === 'Fast' 
                        ? 'bg-success/20 text-success' 
                        : patch.speed === 'Neutral'
                        ? 'bg-zinc-800 text-zinc-400'
                        : 'bg-danger/20 text-danger'
                    }`}>
                      {patch.speed}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </GlassCard>
      </div>

    </div>
  );
};

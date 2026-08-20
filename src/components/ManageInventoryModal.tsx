import React from 'react';
import { InventoryItem } from '../types';

interface ManageInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: InventoryItem[];
  onUpdateStock: (id: string, delta: number) => void;
}

export const ManageInventoryModal: React.FC<ManageInventoryModalProps> = ({
  isOpen,
  onClose,
  inventory,
  onUpdateStock,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-[#fff8f6] border border-[#d7c1c4] rounded-2xl w-full max-w-xl p-6 shadow-xl space-y-6 animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-[#d7c1c4]/40 pb-4">
          <div className="flex items-center gap-2 text-[#8b4b58]">
            <span className="material-symbols-outlined text-[24px]">inventory_2</span>
            <h3 className="font-semibold text-[20px] text-[#201a18]">Manage Bakery Inventory</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#605e5a] hover:text-[#8b4b58] p-1 rounded-full transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        <div className="space-y-4">
          {inventory.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 rounded-xl border border-[#d7c1c4]/30 bg-[#ffffff] hover:shadow-xs transition-shadow"
            >
              <img
                src={item.image}
                alt={item.altText}
                className="w-16 h-16 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-[14px] text-[#201a18]">{item.name}</h4>
                  <span
                    className={`font-semibold text-[11px] px-2.5 py-0.5 rounded-full ${
                      item.status === 'Critical'
                        ? 'bg-[#ffdad6] text-[#93000a]'
                        : item.status === 'Low Stock'
                        ? 'bg-[#ffd9df] text-[#8b4b58]'
                        : item.status === 'Medium'
                        ? 'bg-[#f2e6e1] text-[#524345]'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="w-full bg-[#f8ebe6] h-2 rounded-full my-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      item.stock < 10
                        ? 'bg-[#ba1a1a]'
                        : item.stock < 25
                        ? 'bg-[#d88c9a]'
                        : 'bg-[#8b4b58]'
                    }`}
                    style={{ width: `${Math.min(100, (item.stock / item.maxStock) * 100)}%` }}
                  />
                </div>

                <p className="text-[12px] text-[#605e5a]">
                  Current Stock: <span className="font-bold text-[#201a18]">{item.stock}</span> / {item.maxStock} units
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onUpdateStock(item.id, -1)}
                  disabled={item.stock <= 0}
                  className="w-8 h-8 rounded-lg border border-[#d7c1c4] flex items-center justify-center text-[#524345] hover:bg-[#ede0db] disabled:opacity-40 cursor-pointer"
                >
                  -
                </button>
                <span className="font-bold text-[14px] w-6 text-center text-[#201a18]">
                  {item.stock}
                </span>
                <button
                  onClick={() => onUpdateStock(item.id, 1)}
                  className="w-8 h-8 rounded-lg border border-[#d7c1c4] flex items-center justify-center text-[#524345] hover:bg-[#ede0db] cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-3 border-t border-[#d7c1c4]/40">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#8b4b58] text-white rounded-xl font-semibold text-[12px] shadow-sm hover:bg-[#8b4b58]/90 transition-all cursor-pointer"
          >
            Save Inventory Changes
          </button>
        </div>
      </div>
    </div>
  );
};

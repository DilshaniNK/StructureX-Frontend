// pages/Director/components/InventoryItemCard.jsx
import React from 'react';

const InventoryItemCard = ({ item }) => {
  const { name, quantity, status, color } = item;

  const statusLabel = status === 'low' ? 'Low Stock' : 'Available';
  const statusTextColor = status === 'low' ? 'text-red-600' : 'text-gray-600';
  const quantityColor = color === 'yellow' ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
      <h4 className="font-medium text-gray-900">{name}</h4>
      <p className={`text-2xl font-bold ${quantityColor}`}>{quantity}</p>
      <p className={`text-sm ${statusTextColor}`}>{statusLabel}</p>
    </div>
  );
};

export default InventoryItemCard;

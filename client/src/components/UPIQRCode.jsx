import React from 'react';

const UPIQRCode = ({ upiId = 'deepika84284@okhdfcbank', payeeName = 'AMMU FRAME STORE', amount = 1 }) => {
  const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}&color=000000&bgcolor=ffffff`;

  return (
    <div className="flex flex-col items-center justify-center p-5 bg-white text-black rounded-2xl shadow-2xl border-2 border-amber-400 max-w-xs mx-auto">
      
      {/* Brand Header inside QR card */}
      <div className="text-center mb-3">
        <span className="font-serif font-extrabold text-lg tracking-wider text-amber-600 block">
          AMMU FRAME STORE
        </span>
        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block">
          Official Scan & Pay UPI QR
        </span>
      </div>

      {/* QR Image */}
      <div className="relative p-2 bg-white rounded-xl border border-gray-200 shadow-inner">
        <img 
          src={qrImageUrl} 
          alt="AMMU Frame Store UPI QR Code" 
          className="w-48 h-48 object-contain rounded-lg"
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-9 h-9 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center font-bold text-black text-xs shadow-md">
            🖼️
          </div>
        </div>
      </div>

      {/* UPI Details */}
      <div className="mt-4 text-center space-y-1 w-full">
        <div className="p-2 rounded-lg bg-gray-50 border border-gray-200 font-mono text-xs font-bold text-gray-800 break-all select-all">
          {upiId}
        </div>
        <div className="flex items-center justify-between px-2 pt-1 text-[11px] font-semibold text-gray-600">
          <span>Amount to Pay:</span>
          <span className="text-sm font-extrabold text-amber-600">₹{amount}</span>
        </div>
      </div>

      {/* Supported UPI Apps logos / text */}
      <div className="mt-3 pt-3 border-t border-gray-100 text-[10px] text-gray-500 text-center font-medium">
        Supports Google Pay, PhonePe, Paytm, BHIM & All UPI Apps
      </div>

    </div>
  );
};

export default UPIQRCode;

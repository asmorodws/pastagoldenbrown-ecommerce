import { ReactNode } from 'react';

type Props = {
  icon: ReactNode;
  title: string;
  desc: string;
};

export const AdvantageCard = ({ icon, title, desc }: Props) => (
  <div
    className="grid grid-rows-[auto_auto_1fr] items-start justify-items-center
               bg-white rounded-2xl p-5
               shadow-sm hover:shadow-md
               transition-shadow duration-300
               h-full w-60 text-center"
  >
    {/* Icon */}
    <div className="w-15 h-15 rounded-full
                    bg-gradient-to-br from-amber-400 to-orange-500
                    text-white flex items-center justify-center mb-3">
      {icon}
    </div>

    {/* Judul – dibatasi lebar + text-balance */}
    <h3 className="text-sm font-semibold text-slate-800 leading-5 mb-2
                   max-w-[14rem] text-balance">
      {title}
    </h3>

    {/* Deskripsi – penyangga 2 baris */}
    <div className="min-h-[2.5rem] flex items-start">
      <p className="text-xs text-slate-600 leading-4 text-center">
        {desc}
      </p>
    </div>
  </div>
);
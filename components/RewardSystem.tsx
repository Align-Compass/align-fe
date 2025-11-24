import React from 'react';
import { Reward } from '../types';

interface Props {
  rewards: Reward[];
  totalSavings: number;
}

const RewardSystem: React.FC<Props> = ({ rewards, totalSavings }) => {
  // Calculate total points (1 point per R$ 1 saved this month - simulated logic)
  const points = Math.floor(totalSavings * 0.1); // 10% of savings are points

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800 text-lg">Recompensas do Casal</h3>
        <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
          ⭐ {points} Pontos
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {rewards.map(reward => {
          const progress = Math.min(100, (points / reward.cost) * 100);
          const canUnlock = points >= reward.cost && !reward.unlocked;

          return (
            <div key={reward.id} className={`border rounded-xl p-3 relative overflow-hidden ${reward.unlocked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
              <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3">
                  <span className="text-2xl grayscale-0">{reward.icon}</span>
                  <div>
                    <h4 className={`font-semibold ${reward.unlocked ? 'text-green-800' : 'text-gray-700'}`}>{reward.title}</h4>
                    <p className="text-xs text-gray-500">{reward.cost} pontos</p>
                  </div>
                </div>
                
                {reward.unlocked ? (
                  <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-medium">Resgatado</span>
                ) : canUnlock ? (
                  <button className="text-xs bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full font-bold shadow-sm transition-colors">
                    Resgatar!
                  </button>
                ) : (
                  <span className="text-xs text-gray-400 font-medium">{Math.round(progress)}%</span>
                )}
              </div>
              
              {!reward.unlocked && (
                <div 
                  className="absolute bottom-0 left-0 h-1 bg-yellow-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">
        Economizem juntos para desbloquear experiências!
      </p>
    </div>
  );
};

export default RewardSystem;
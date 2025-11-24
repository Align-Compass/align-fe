import React from 'react';
import { Goal } from '../types';

interface Props {
	goal: Goal;
}

const GoalThermometer: React.FC<Props> = ({ goal }) => {
	const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

	return (
		<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3">
			<div className="flex justify-between items-center mb-2">
				<div className="flex items-center gap-2">
					<span className="text-2xl bg-gray-50 p-2 rounded-full">{goal.icon}</span>
					<div>
						<h4 className="font-semibold text-gray-800">{goal.title}</h4>
						<p className="text-xs text-gray-500">
							Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
						</p>
					</div>
				</div>
				<div className="text-right">
					<span className="text-lg font-bold text-primary">{percentage}%</span>
					<p className="text-xs text-gray-500">
						R$ {goal.currentAmount.toLocaleString('pt-BR')} / R${' '}
						{goal.targetAmount.toLocaleString('pt-BR')}
					</p>
				</div>
			</div>

			<div className="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden">
				<div
					className="absolute top-0 left-0 h-full bg-gradient-to-r from-secondary to-green-400 transition-all duration-1000 ease-out"
					style={{ width: `${percentage}%` }}
				/>
			</div>
			{percentage >= 100 && (
				<div className="mt-2 text-center text-sm text-green-600 font-bold animate-pulse">
					🎉 Meta Atingida! Parabéns ao casal!
				</div>
			)}
		</div>
	);
};

export default GoalThermometer;

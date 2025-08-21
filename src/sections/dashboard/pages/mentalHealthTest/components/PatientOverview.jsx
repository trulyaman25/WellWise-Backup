import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { ScoreDistributionChart } from '../../../components/testDashboard_components/AnalyticsCharts';

const PatientOverview = ({ patientCredentials, depressionScore, depressionStatus, scores }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-googleSansBold text-gray-800">Patient Overview</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-100 p-6 rounded-3xl space-y-4">
                    <h3 className="font-googleSansMedium text-gray-700">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <span className="text-gray-500 text-sm">Name</span>
                            <p className="font-medium text-gray-800 truncate">{patientCredentials.name}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-gray-500 text-sm">Health ID</span>
                            <p className="font-medium text-gray-800 truncate">{patientCredentials.healthID}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-gray-500 text-sm">Email</span>
                            <p className="font-medium text-gray-800 truncate">{patientCredentials.email}</p>
                        </div>
                        <div className="space-y-1 col-span-2">
                            <span className="text-gray-500 text-sm">Wallet Address</span>
                            <p className="font-medium text-gray-800 truncate">{patientCredentials.cryptoWalletAddress}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-100 p-6 rounded-3xl">
                    <div className="flex items-center justify-between">
                        <div className="w-full">
                            <h3 className="font-googleSansMedium text-gray-700 mb-4">Assessment Summary</h3>
                            <div className="flex items-center justify-evenly">
                                <div>
                                    <CircularProgressbar value={depressionScore} text={`${depressionScore}%`} strokeWidth={12} styles={buildStyles({ pathColor: depressionStatus.color, textColor: depressionStatus.color, trailColor: '#F5F5F5'})} className="w-fit h-fit max-w-32 max-h-32 p-2" />
                                </div>
                                <div className="w-28 h-28">
                                    <ScoreDistributionChart scores={scores} />
                                </div>
                            </div>
                            <div className="mt-4 w-full flex flex-row justify-between items-center gap-2 pr-10 bg-white px-3 py-2 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-700 font-googleSansBold" >Depression Level: </span>
                                </div>
                                <div className="text-gray-700 font-googleSansBold">
                                    <span style={{ color: depressionStatus.color }} className="font-medium font-googleSansBold ml-1"> {depressionStatus.level} </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientOverview;

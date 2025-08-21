import { motion, AnimatePresence } from 'framer-motion';
import RazorpayButton from '../payment';
import { X } from 'lucide-react';
import doctorData from '../../essentialData/doctorData.json';

const AppointmentModal = ({ isOpen, onClose }) => {
	if (!isOpen) return null;

	return (
		<AnimatePresence>
			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={onClose} >
				<motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ type: "spring", duration: 0.5 }} className="bg-white rounded-xl p-6 w-[800px] max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()} >
					<div className="flex justify-between items-center mb-6">
						<h3 className="text-xl font-googleSansBold text-gray-800">Schedule Appointment</h3>
						<button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
							<X size={20} className="text-gray-500" />
						</button>
					</div>

					<div className="grid gap-6">
						{doctorData.map((doc) => (
						<div key={doc.id} className="p-4 rounded-lg border transition-all border-gray-200 hover:border-[#1a5252]/50">
							<div className="flex items-center gap-4">
								<img src={doc.image} alt={doc.name} className="w-16 h-16 rounded-full object-cover" />

								<div className="flex-1">
									<div className='flex justify-between items-center'>
										<div>
											<h4 className="text-lg font-medium text-gray-900">
												{doc.name}
											</h4>

											<p className="text-[#1a5252] font-medium">
												{doc.specialty}
											</p>
										</div>

										<p className="text-lg font-medium text-gray-900">
											<span className='font-albulaBold'>₹ {doc.fee}</span>
										</p>
									</div>

									<div className="flex justify-between items-center gap-4 mt-1 pt-5 text-sm text-gray-500">
										<div className='flex gap-7'>
											<div>
												<div className='font-albulaBold'>Experience:</div>
												<div>{doc.experience}</div>
											</div>

											<div>
												<div className='font-albulaBold'>Available:</div>
												<div>{doc.availability}</div>
											</div>
										</div>

										<RazorpayButton />
									</div>
								</div>
							</div>
						</div>
						))}
					</div>

					<div className="mt-6 p-4 bg-gray-50 rounded-lg">
						<p className="text-sm text-gray-600">
							<div>
								• Payment is required to schedule an appointment
							</div>

							<div>
								• You'll be redirected to Google Meet after successful payment
							</div>

							<div>
								• Consultation duration: 45 minutes
							</div>
						</p>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};

export default AppointmentModal;
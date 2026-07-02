import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, addDays, parseISO, getDay } from 'date-fns';
import { motion } from 'framer-motion';
import {
  HiCalendar,
  HiClock,
  HiUserGroup,
} from 'react-icons/hi';
import { useCreateReservation, useAvailability } from '../../hooks/useReservations';
import VisualTable from '../../components/VisualTable';

const todayDate = new Date();
const today = format(todayDate, 'yyyy-MM-dd');
const maxDate = format(addDays(todayDate, 30), 'yyyy-MM-dd');

const AVAILABLE_DATES = [];
for (let i = 0; i <= 30; i++) {
  const d = addDays(todayDate, i);
  if (getDay(d) !== 1) { // Skip Mondays
    AVAILABLE_DATES.push({
      dateStr: format(d, 'yyyy-MM-dd'),
      dayNum: format(d, 'dd'),
      dayName: format(d, 'EEE'),
      monthName: format(d, 'MMM'),
    });
  }
}

const TIME_SLOTS = [
  { label: '11:00 AM - 12:00 PM', start: '11:00', end: '12:00' },
  { label: '12:00 PM - 1:00 PM', start: '12:00', end: '13:00' },
  { label: '1:00 PM - 2:00 PM', start: '13:00', end: '14:00' },
  { label: '2:00 PM - 3:00 PM', start: '14:00', end: '15:00' },
  { label: '3:00 PM - 4:00 PM', start: '15:00', end: '16:00' },
  { label: '7:00 PM - 8:00 PM', start: '19:00', end: '20:00' },
  { label: '8:00 PM - 9:00 PM', start: '20:00', end: '21:00' },
  { label: '9:00 PM - 10:00 PM', start: '21:00', end: '22:00' },
  { label: '10:00 PM - 11:00 PM', start: '22:00', end: '23:00' },
];

const reservationSchema = z
  .object({
    date: z
      .string()
      .min(1, 'Date is required')
      .refine((val) => val >= today, 'Date cannot be in the past')
      .refine((val) => val <= maxDate, 'Reservations can only be made up to 30 days in advance')
      .refine((val) => getDay(parseISO(val)) !== 1, 'We are closed on Mondays. Please select another day.'),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    guests: z
      .number({ invalid_type_error: 'Number of guests is required' })
      .min(1, 'At least 1 guest required')
      .max(6, 'Maximum 6 guests'),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return data.endTime > data.startTime;
      }
      return true;
    },
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    }
  );

export default function NewReservation() {
  const navigate = useNavigate();
  const createReservation = useCreateReservation();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      date: '',
      startTime: '',
      endTime: '',
      guests: 2,
    },
  });

  const onSubmit = async (data) => {
    try {
      await createReservation.mutateAsync({
        reservationDate: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        guestCount: data.guests,
      });
      navigate('/reservations');
    } catch (error) {
      if (error.response?.status === 409) {
        setError('root', {
          message:
            'No tables available for the selected date and time. Please try a different slot.',
        });
      } else {
        setError('root', {
          message:
            error.response?.data?.message ||
            'Failed to create reservation. Please try again.',
        });
      }
    }
  };

  const selectedDate = watch('date');
  const selectedStart = watch('startTime');
  const selectedGuests = watch('guests');

  const { data: availableSlots, isLoading: checkingAvailability } = useAvailability(selectedDate, selectedGuests);

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Reservation</h1>
        <p className="mt-1 text-gray-500">
          Book a table for your next dining experience.
        </p>
      </div>

      <div className="glass p-8">
        {errors.root && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-sm text-red-600 font-medium">
              {errors.root.message}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Left Column (Date & Time) */}
          <div className="lg:col-span-7 space-y-10">
            {/* Date Slider */}
            <div>
              <label className="label mb-4">
                <span className="flex items-center gap-2">
                  <HiCalendar className="w-4 h-4 text-gray-400" />
                  Select Date
                </span>
              </label>
              <div className="flex overflow-x-auto pb-6 gap-4 snap-x">
                {AVAILABLE_DATES.map((dateObj, i) => {
                  const isSelected = selectedDate === dateObj.dateStr;
                  return (
                    <motion.button
                      key={dateObj.dateStr}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      type="button"
                      onClick={() => setValue('date', dateObj.dateStr, { shouldValidate: true })}
                      className={`flex-shrink-0 snap-start flex flex-col items-center justify-center w-[4.5rem] h-20 rounded-2xl transition-all duration-200 border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30 scale-105'
                          : 'bg-gray-100 border-gray-200 hover:bg-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <span className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                        {dateObj.dayNum}
                      </span>
                      <span className={`text-xs font-medium uppercase tracking-wider ${isSelected ? 'text-indigo-200' : 'text-gray-500'}`}>
                        {dateObj.dayName}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
              <input type="hidden" {...register('date')} />
              {errors.date && (
                <p className="mt-1 text-xs text-red-500">{errors.date.message}</p>
              )}
            </div>

            {/* Time Slots */}
            <div>
              <label className="label mb-4">
                <span className="flex items-center gap-2">
                  <HiClock className="w-4 h-4 text-gray-400" />
                  Select Time Slot
                  {checkingAvailability && (
                    <span className="text-xs font-normal text-indigo-500 animate-pulse ml-2">
                      Checking availability...
                    </span>
                  )}
                </span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = selectedStart === slot.start;
                  const isAvailable = availableSlots ? availableSlots.includes(slot.start) : true;
                  const isDisabled = selectedDate && !isAvailable && !checkingAvailability;

                  return (
                    <button
                      key={slot.start}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        setValue('startTime', slot.start, { shouldValidate: true });
                        setValue('endTime', slot.end, { shouldValidate: true });
                      }}
                      className={`px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                        isDisabled
                          ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed opacity-60'
                          : isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                            : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 hover:text-gray-900 hover:border-gray-400'
                      }`}
                    >
                      {slot.label}
                      {isDisabled && <span className="block text-[10px] mt-0.5 text-red-400/80">Booked</span>}
                    </button>
                  );
                })}
              </div>
              {(errors.startTime || errors.endTime) && (
                <p className="mt-2 text-xs text-red-500">Please select a time slot</p>
              )}
            </div>
          </div>

          {/* Right Column (Visual Table & Submit) */}
          <div className="lg:col-span-5 flex flex-col gap-10 border-t lg:border-t-0 lg:border-l border-gray-100/50 pt-10 lg:pt-0 lg:pl-8">
            <div>
              <label className="label mb-8 text-center lg:text-left">
                <span className="flex items-center justify-center lg:justify-start gap-2">
                  <HiUserGroup className="w-4 h-4 text-gray-400" />
                  Select Party Size
                </span>
              </label>

              <VisualTable 
                currentGuests={selectedGuests} 
                onChange={(num) => setValue('guests', num, { shouldValidate: true })} 
              />
              <input type="hidden" {...register('guests')} />
              {errors.guests && (
                <p className="mt-6 text-center text-xs text-red-500">{errors.guests.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || createReservation.isPending}
              className="btn-primary w-full py-4 text-lg mt-auto"
            >
              {isSubmitting || createReservation.isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Booking...
                </div>
              ) : (
                'Book Table'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

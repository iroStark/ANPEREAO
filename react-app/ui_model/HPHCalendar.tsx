import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  isToday,
  addWeeks,
  subWeeks
} from 'date-fns';
import { pt } from 'date-fns/locale';
import { 
  ArrowLeft01Icon as ChevronLeftIcon, 
  ArrowRight01Icon as ChevronRightIcon, 
  Calendar03Icon,
  Video01Icon,
  Stethoscope02Icon,
  MoreVerticalIcon
} from 'hugeicons-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { HPHBadge } from '@/components/ui/HPHBadge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'TELECONSULTA' | 'PRESENCIAL';
  status: string;
  color?: string;
  extendedProps?: any;
}

interface HPHCalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
}

type CalendarView = 'day' | 'week' | 'month';

const HPHCalendar: React.FC<HPHCalendarProps> = ({ events, onEventClick, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');

  const next = () => {
    if (view === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (view === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const prev = () => {
    if (view === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (view === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else setCurrentDate(subDays(currentDate, 1));
  };

  const goToToday = () => setCurrentDate(new Date());

  const renderHeader = () => {
    return (
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 bg-white dark:bg-[#10101E] p-6 rounded-2xl border border-gray-100 dark:border-[#252540] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-50 dark:bg-primary-500/10 rounded-full text-primary-600 dark:text-primary-400">
            <Calendar03Icon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-700 dark:text-white tracking-tight capitalize">
              {format(currentDate, 'MMMM yyyy', { locale: pt })}
            </h2>
            <p className="text-xs text-gray-400 font-medium tracking-tight">Gestão Visual de Agendamentos</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-50 dark:bg-[#1A1A2E] p-1.5 rounded-2xl border border-gray-100 dark:border-[#252540]">
            {(['day', 'week', 'month'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all",
                  view === v 
                    ? "bg-white dark:bg-[#252540] text-primary-600 dark:text-white shadow-sm" 
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                )}
              >
                {v === 'day' ? 'Dia' : v === 'week' ? 'Semana' : 'Mês'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-gray-50 dark:bg-[#1A1A2E] p-1.5 rounded-2xl border border-gray-100 dark:border-[#252540]">
            <button onClick={prev} className="p-2 hover:bg-white dark:hover:bg-[#252540] rounded-xl transition-all text-gray-500">
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button onClick={goToToday} className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-white dark:hover:bg-[#252540] rounded-xl text-gray-500">
              Hoje
            </button>
            <button onClick={next} className="p-2 hover:bg-white dark:hover:bg-[#252540] rounded-xl transition-all text-gray-500">
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center py-4">
          {format(addDays(startDate, i), 'EEE', { locale: pt })}
        </div>
      );
    }

    const rows: React.ReactNode[] = [];
    let daysInWeek: React.ReactNode[] = [];

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    calendarDays.forEach((d, i) => {
      const formattedDate = format(d, "d");
      const dayEvents = events.filter(e => isSameDay(e.start, d));

      daysInWeek.push(
        <div
          key={d.toString()}
          className={cn(
            "min-h-[140px] p-2 border-r border-b border-gray-100 dark:border-[#252540] transition-colors hover:bg-gray-50/50 dark:hover:bg-primary-500/5",
            !isSameMonth(d, monthStart) && "bg-gray-50/30 dark:bg-black/10",
            isToday(d) && "bg-primary-500/5"
          )}
          onClick={() => onDateClick?.(d)}
        >
          <div className="flex justify-between items-center mb-2">
            <span className={cn(
              "text-xs font-bold w-7 h-7 flex items-center justify-center rounded-lg",
              isToday(d) ? "bg-primary-600 text-white" : "text-gray-500 dark:text-gray-400",
              !isSameMonth(d, monthStart) && "opacity-30"
            )}>
              {formattedDate}
            </span>
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 3).map(event => (
              <div
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick?.(event);
                }}
                className={cn(
                  "px-2 py-1.5 rounded-lg text-[9px] font-bold truncate cursor-pointer transition-all border shadow-sm flex items-center gap-1.5",
                  event.type === 'TELECONSULTA' 
                    ? "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400" 
                    : "bg-primary-500/10 border-primary-500/20 text-primary-600 dark:text-primary-400"
                )}
                title={event.title}
              >
                <div className={cn("w-1.5 h-1.5 rounded-full", event.type === 'TELECONSULTA' ? "bg-blue-500" : "bg-primary-500")} />
                <span className="opacity-60 text-[8px]">{format(event.start, 'HH:mm')}</span>
                <span className="truncate">{event.title}</span>
              </div>
            ))}
            {dayEvents.length > 3 && (
              <div className="text-[9px] font-bold text-gray-400 px-2">+ {dayEvents.length - 3} mais</div>
            )}
          </div>
        </div>
      );

      if ((i + 1) % 7 === 0) {
        rows.push(
          <div className="grid grid-cols-7" key={d.toString()}>
            {daysInWeek}
          </div>
        );
        daysInWeek = [];
      }
    });

    return (
      <div className="bg-white dark:bg-[#10101E] rounded-3xl border border-gray-100 dark:border-[#252540] overflow-hidden shadow-sm">
        <div className="grid grid-cols-7 border-b border-gray-100 dark:border-[#252540] bg-gray-50/50 dark:bg-black/20">
          {days}
        </div>
        <div className="flex flex-col">
          {rows}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });
    const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 to 20:00

    return (
      <div className="bg-white dark:bg-[#10101E] rounded-3xl border border-gray-100 dark:border-[#252540] shadow-sm overflow-hidden flex flex-col h-[700px]">
        {/* Header dos dias */}
        <div className="grid grid-cols-[80px_1fr] border-b border-gray-100 dark:border-[#252540] bg-gray-50/50 dark:bg-black/20 z-10">
          <div className="p-4 border-r border-gray-100 dark:border-[#252540]"></div>
          <div className="grid grid-cols-7">
            {days.map(d => (
              <div key={d.toString()} className="text-center py-4 flex flex-col items-center gap-1 border-r border-gray-100 last:border-0 dark:border-[#252540]">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{format(d, 'EEE', { locale: pt })}</span>
                <span className={cn(
                  "text-sm font-bold w-8 h-8 flex items-center justify-center rounded-xl",
                  isToday(d) ? "bg-primary-600 text-white" : "text-gray-900 dark:text-white"
                )}>
                  {format(d, 'd')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Grid de Horários */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="grid grid-cols-[80px_1fr] h-full">
            <div className="bg-gray-50/30 dark:bg-black/10 border-r border-gray-100 dark:border-[#252540]">
              {hours.map(hour => (
                <div key={hour} className="h-[120px] text-[10px] font-bold text-gray-400 text-right pr-4 pt-2 uppercase tracking-tighter">
                  {`${hour.toString().padStart(2, '0')}:00`}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 relative">
              {/* Linhas de fundo */}
              {hours.map(hour => (
                <div key={hour} className="absolute w-full h-px bg-gray-100 dark:bg-[#252540]/50" style={{ top: `${(hour - 7) * 120}px` }} />
              ))}
              
              {/* Colunas dias */}
              {days.map((d) => (
                <div key={d.toString()} className="relative border-r border-gray-100 dark:border-[#252540] last:border-0 h-full">
                  {events.filter(e => isSameDay(e.start, d)).map(event => {
                    const startHour = event.start.getHours() + event.start.getMinutes() / 60;
                    const durationInHours = (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60);
                    const top = (startHour - 7) * 120;
                    const height = durationInHours * 120;

                    return (
                      <div
                        key={event.id}
                        onClick={() => onEventClick?.(event)}
                        className={cn(
                          "absolute inset-x-1 rounded-2xl p-3 text-[10px] font-bold border shadow-md flex flex-col justify-between overflow-hidden cursor-pointer hover:scale-[1.02] transition-all z-10",
                          event.type === 'TELECONSULTA' 
                            ? "bg-blue-500 dark:bg-blue-600 text-white border-blue-400 shadow-blue-500/20" 
                            : "bg-primary-600 dark:bg-primary-700 text-white border-primary-500 shadow-primary-500/20"
                        )}
                        style={{ top: `${top}px`, height: `${height}px` }}
                      >
                         <div className="flex items-center gap-1.5 opacity-90 text-[8px] uppercase font-bold mb-1">
                            {event.type === 'TELECONSULTA' ? <Video01Icon className="w-3.5 h-3.5" /> : <Stethoscope02Icon className="w-3.5 h-3.5" />}
                            {format(event.start, 'HH:mm')}
                         </div>
                         <div className="truncate mb-1 text-[11px] leading-tight">{event.title}</div>
                         <div className="text-[9px] opacity-70 truncate mt-auto">{event.status}</div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const d = currentDate;
    const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 to 20:00
    const dayEvents = events.filter(e => isSameDay(e.start, d));

    return (
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 h-[700px]">
        <div className="bg-white dark:bg-[#10101E] rounded-3xl border border-gray-100 dark:border-[#252540] shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-6 bg-gray-50/50 dark:bg-black/20 border-b border-gray-100 dark:border-[#252540]">
             <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-3">
                <span className="text-primary-600 text-lg">{format(d, 'd')}</span>
                {format(d, 'EEEE, MMMM yyyy', { locale: pt })}
             </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar relative p-8">
             <div className="relative">
                {hours.map(hour => (
                  <div key={hour} className="flex gap-6 h-40 relative">
                    <div className="w-16 text-[10px] font-bold text-gray-400 uppercase tracking-tighter pt-1 text-right">
                       {`${hour.toString().padStart(2, '0')}:00`}
                    </div>
                    <div className="flex-1 border-t border-gray-100 dark:border-[#252540] pt-1 opacity-50" />
                  </div>
                ))}

                {dayEvents.map(event => {
                  const startHour = event.start.getHours() + event.start.getMinutes() / 60;
                  const durationInHours = (event.end.getTime() - event.start.getTime()) / (1000 * 60 * 60);
                  const top = (startHour - 7) * 160; // Increased to 160 for better spacing
                  const height = durationInHours * 160;

                  return (
                    <div
                      key={event.id}
                      onClick={() => onEventClick?.(event)}
                      className={cn(
                        "absolute left-24 right-4 rounded-[32px] px-8 py-6 text-sm border shadow-xl flex items-center justify-between cursor-pointer hover:shadow-2xl transition-all group",
                        event.type === 'TELECONSULTA' 
                          ? "bg-white dark:bg-blue-600/10 text-blue-900 dark:text-white border-blue-500/20" 
                          : "bg-white dark:bg-primary-600/10 text-primary-900 dark:text-white border-primary-500/20"
                      )}
                      style={{ top: `${top}px`, height: `${height}px` }}
                    >
                       <div className="flex items-center gap-8">
                          <div className={cn(
                            "w-16 h-16 rounded-full flex items-center justify-center border shrink-0 transition-transform group-hover:scale-110 duration-300",
                            event.type === 'TELECONSULTA' 
                              ? "bg-blue-500/10 border-blue-500/20 text-blue-600" 
                              : "bg-primary-500/10 border-primary-500/20 text-primary-600"
                          )}>
                             {event.type === 'TELECONSULTA' ? <Video01Icon className="w-10 h-10" /> : <Stethoscope02Icon className="w-10 h-10" />}
                          </div>
                          <div className="flex flex-col gap-1.5">
                             <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-gray-50 dark:bg-black/30 rounded-full text-gray-500 border border-gray-100 dark:border-white/5">
                                   {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                                </span>
                                <HPHBadge variant={event.status === 'Confirmado' || event.status === 'Concluído' ? 'green' : 'blue'}>
                                   {event.status}
                                </HPHBadge>
                             </div>
                             <h4 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">{event.title}</h4>
                             <p className="text-xs text-gray-500 font-medium opacity-80">{event.type === 'TELECONSULTA' ? 'Sessão Virtual Segura' : 'Atendimento Presencial - Bloco A'}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-2">
                          <button className="opacity-0 group-hover:opacity-100 p-3 hover:bg-gray-100 dark:hover:bg-white/10 rounded-2xl transition-all flex items-center justify-center">
                             <MoreVerticalIcon className="w-6 h-6 text-gray-400" />
                          </button>
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="bg-primary-600 p-8 rounded-[32px] text-white shadow-xl shadow-primary-500/20">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 opacity-70">Sumário do Dia</h4>
              <div className="space-y-6">
                 <div>
                    <p className="text-3xl font-bold">{dayEvents.length}</p>
                    <p className="text-xs font-medium opacity-80">Consultas Agendadas</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                    <div>
                       <p className="text-xl font-bold">{dayEvents.filter(e => e.type === 'TELECONSULTA').length}</p>
                       <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Virtuais</p>
                    </div>
                    <div>
                       <p className="text-xl font-bold">{dayEvents.filter(e => e.type === 'PRESENCIAL').length}</p>
                       <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">Presenciais</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-white dark:bg-[#10101E] p-8 rounded-[32px] border border-gray-100 dark:border-[#252540] shadow-sm">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">Próximos em Destaque</h4>
              <div className="space-y-6">
                 {dayEvents.filter(e => e.start > new Date()).slice(0, 3).map(e => (
                    <div key={e.id} className="flex gap-4">
                       <div className="w-1 h-10 rounded-full bg-primary-500" />
                       <div>
                          <p className="text-[10px] font-bold text-primary-600 uppercase">{format(e.start, 'HH:mm')}</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{e.title}</p>
                       </div>
                    </div>
                 ))}
                 {dayEvents.length === 0 && <p className="text-xs text-gray-400 italic">Sem eventos para o resto do dia.</p>}
              </div>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-container animate-in fade-in duration-500">
      {renderHeader()}
      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'day' && renderDayView()}
    </div>
  );
};

export default HPHCalendar;

function subDays(date: Date, amount: number): Date {
    return addDays(date, -amount);
}

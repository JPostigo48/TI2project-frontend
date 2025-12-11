import { ACADEMIC_HOURS, DAY_INDEX, DAYS } from './constants'; 


export const getCurrentAcademicContext = (schedule = [], reservations = []) => {
  const now = new Date();
  const currentDayIndex = now.getDay();
  
  const daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = daysMap[currentDayIndex];
  
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // 1. BUSCAR EN HORARIO REGULAR
  const activeBlock = schedule.find(block => {
    if (block.day !== todayName) return false;

    const startInfo = ACADEMIC_HOURS[block.startHour];
    const endBlockNum = block.startHour + (block.duration || 1) - 1;
    const endInfo = ACADEMIC_HOURS[endBlockNum];

    if (!startInfo || !endInfo) return false;

    const [startH, startM] = startInfo.start.split(':').map(Number);
    const [endH, endM] = endInfo.end.split(':').map(Number);

    const blockStartMins = startH * 60 + startM;
    const blockEndMins = endH * 60 + endM;

    return currentMinutes >= (blockStartMins - 10) && currentMinutes <= (blockEndMins + 10);
  });

  if (activeBlock) {
    return { type: 'REGULAR', data: activeBlock };
  }
  
  return null;
};

export const getNextOrCurrentClass = (flatSchedule) => {
  if (!flatSchedule || flatSchedule.length === 0) return null;

  const now = new Date();
  const currentDayIdx = now.getDay(); 
  const currentMinutes = now.getHours() * 60 + now.getMinutes(); 

  let foundClass = null;
  let minDiff = Infinity; 
  let status = 'NEXT'; // 'CURRENT' | 'NEXT'

  flatSchedule.forEach(block => {
    const blockDayIdx = DAY_INDEX[block.day];
    
    const startInfo = ACADEMIC_HOURS[block.startHour];
    const endBlockNum = block.startHour + (block.duration || 1) - 1;
    const endInfo = ACADEMIC_HOURS[endBlockNum];

    if (!startInfo || !endInfo) return;

    const [sh, sm] = startInfo.start.split(':').map(Number);
    const [eh, em] = endInfo.end.split(':').map(Number);
    
    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    let diff = null;

    if (blockDayIdx === currentDayIdx) {
      if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
        diff = -1;
      } else if (currentMinutes < startMinutes) {
        diff = startMinutes - currentMinutes;
      }
    } else {
      let dayDiff = blockDayIdx - currentDayIdx;
      if (dayDiff < 0) dayDiff += 7;
      diff = (dayDiff * 24 * 60) + (startMinutes - currentMinutes);
    }

    // Evaluación
    if (diff !== null) {
      if (diff === -1) {
        foundClass = block;
        status = 'CURRENT';
        minDiff = -1; 
      } 
      else if (diff < minDiff && minDiff !== -1) {
        minDiff = diff;
        foundClass = block;
        status = 'NEXT';
      }
    }
  });

  if (!foundClass) return null;

  return {
    data: foundClass,
    status: status,
    timeDisplay: `${ACADEMIC_HOURS[foundClass.startHour].start} - ${ACADEMIC_HOURS[foundClass.startHour + (foundClass.duration||1) - 1].end}`
  };
};



export const getTimeRangeFromBlocks = (startBlock, endBlock) => {
  if (!startBlock || !endBlock) return '';

  const start = ACADEMIC_HOURS[Number(startBlock)];
  const end = ACADEMIC_HOURS[Number(endBlock)];

  if (!start || !end) return '';

  return `${start.start} - ${end.end}`;
};

export const getBlocksLabel = (startBlock, endBlock) => {
  if (!startBlock || !endBlock) return '';
  const start = ACADEMIC_HOURS[Number(startBlock)];
  const end = ACADEMIC_HOURS[Number(endBlock)];
  if (!start || !end) return '';
  if (Number(startBlock) === Number(endBlock)) return start.label;
  return `${start.label}–${end.label}`;
};

// Normaliza un bloque del back ({day, startHour, duration}) 
export const normalizeBlock = (block) => {
  if (!block || !block.startHour || !block.duration) return null;
  const startBlock = block.startHour;
  const endBlock = block.startHour + block.duration - 1;
  return {
    dayOfWeek: block.day,
    startBlock,
    endBlock,
    room: block.room,
  };
};

// Devuelve el bloque principal
export const getMainBlockFromSection = (section) => {
  if (!section || !section.schedule || section.schedule.length === 0) return null;
  return normalizeBlock(section.schedule[0]);
};

export const getScheduleLabel = (schedule) => {
  if (
    !schedule ||
    !schedule.dayOfWeek ||
    !schedule.startBlock ||
    !schedule.endBlock
  ) {
    return '—';
  }

  const dayLabel = DAYS[schedule.dayOfWeek] || schedule.dayOfWeek;
  const blocksLabel = getBlocksLabel(schedule.startBlock, schedule.endBlock);
  const timeRange = getTimeRangeFromBlocks(
    schedule.startBlock,
    schedule.endBlock
  );

  return `${dayLabel} ${blocksLabel} (${timeRange})`;
};
import { useMemo, useState } from 'react';
export default function useReservation(tables = []) {
  const [date, setDate] = useState(''); const [time, setTime] = useState('12:00'); const [partySize, setPartySize] = useState(2); const [table, setTable] = useState(null); const [contact, setContact] = useState({ name: '', phone: '' });
  const slots = useMemo(() => Array.from({ length: 11 }, (_, i) => `${String(i + 12).padStart(2, '0')}:00`), []);
  const availableTables = useMemo(() => tables.filter(t => Number(t.seats) >= Number(partySize) && t.isActive !== false), [tables, partySize]);
  const createReservation = () => ({ date, time, partySize: Number(partySize), table: table?._id || table?.id, tableLabel: table?.label || table?.number || '', contactName: contact.name.trim(), phone: contact.phone.trim() });
  return { date, setDate, time, setTime, partySize, setPartySize, table, setTable, contact, setContact, slots, availableTables, createReservation };
}

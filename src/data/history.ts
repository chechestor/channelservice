import type { HistoryEntry } from "../types";

export type HistoryByRequest = Record<number, HistoryEntry[]>;

export const INITIAL_HISTORY: HistoryByRequest = {
  10427: [{ id: "10427-created", time: "14:32", text: "Заявка создана" }],
  10428: [
    { id: "10428-created", time: "14:38", text: "Заявка создана" },
    {
      id: "10428-claimed",
      time: "14:39",
      text: "Игорь Смирнов взял заявку в работу",
    },
  ],
  10425: [
    { id: "10425-created", time: "14:05", text: "Заявка создана" },
    {
      id: "10425-claimed",
      time: "14:06",
      text: "Игорь Смирнов взял заявку в работу",
    },
    {
      id: "10425-assigned",
      time: "14:08",
      text: "Игорь Смирнов назначил Бригаду №1",
    },
  ],
  10426: [
    { id: "10426-created", time: "13:50", text: "Заявка создана" },
    {
      id: "10426-claimed",
      time: "13:51",
      text: "Елена Орлова взяла заявку в работу",
    },
    {
      id: "10426-assigned",
      time: "13:54",
      text: "Елена Орлова назначила Бригаду №2",
    },
  ],
  10424: [{ id: "10424-created", time: "14:12", text: "Заявка создана" }],
  10429: [
    { id: "10429-created", time: "14:45", text: "Заявка создана" },
    {
      id: "10429-claimed",
      time: "14:46",
      text: "Елена Орлова взяла заявку в работу",
    },
  ],
  10430: [{ id: "10430-created", time: "14:50", text: "Заявка создана" }],
  10420: [
    { id: "10420-created", time: "11:20", text: "Заявка создана" },
    {
      id: "10420-claimed",
      time: "11:22",
      text: "Игорь Смирнов взял заявку в работу",
    },
    {
      id: "10420-assigned",
      time: "11:30",
      text: "Игорь Смирнов назначил Бригаду №1",
    },
    { id: "10420-done", time: "13:10", text: "Заявка завершена" },
  ],
  10418: [
    { id: "10418-created", time: "09:15", text: "Заявка создана" },
    {
      id: "10418-claimed",
      time: "09:18",
      text: "Елена Орлова взяла заявку в работу",
    },
    {
      id: "10418-assigned",
      time: "09:40",
      text: "Елена Орлова назначила Бригаду №4",
    },
    { id: "10418-done", time: "12:05", text: "Заявка завершена" },
  ],
  10415: [
    { id: "10415-created", time: "16:40", text: "Заявка создана" },
    { id: "10415-cancelled", time: "17:02", text: "Заявка отменена" },
  ],
};

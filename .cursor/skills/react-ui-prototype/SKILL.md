---
name: react-ui-prototype
description: >-
  Builds React UI prototypes for Channel Service: screens, navigation, mock data,
  interaction states, and maintainable component structure. Use when developing
  frontend prototype screens, React components, layouts, or demo UI flows.
---

# React UI Prototype

Skill для Senior React Developer: быстрый, аккуратный прототип интерфейса без over-engineering.

## Когда применять

- Новый экран или поток (list → details → action)
- Сборка каркаса приложения (layout, router, shell)
- Моки API и демо-данные
- Доработка состояний UI (loading / empty / error)

## Workflow

1. **Понять задачу**
   - Цель экрана для пользователя
   - Входные данные / сущности
   - Что кликабельно в прототипе, что — заглушка
   - Контекст и ТЗ — в `tasks/` (для текущего прототипа: `tasks/specs/назначение-бригады/`)

2. **Спроектировать структуру**
   - Страница в `pages/` или `routes/`
   - Компоненты фичи в `components/<feature>/` или `features/<feature>/`
   - Типы в `types/`
   - Моки в `mocks/`

3. **Реализовать вертикальный срез**
   - Сначала happy-path
   - Затем empty / loading / error
   - Затем адаптив и a11y-база

4. **Проверить**
   - Сборка / dev-server
   - Ручной проход сценария
   - Краткий отчёт: пути файлов + как проверить

## Правила прототипа

- Предпочитай **реально работающие** взаимодействия имитации «красивых картинок»
- Данные — моки с типизацией; форма ответа близка к будущему API
- Не тащи тяжёлые библиотеки без явной пользы для текущего экрана
- Один визуальный язык на весь прототип (цвета, отступы, типографика через CSS variables)
- Не смешивай несколько подходов к стилям в одном PR/задаче

## Шаблон страницы

```tsx
export function FeaturePage() {
  // 1. данные (мок / хук)
  // 2. derived state
  // 3. handlers
  // 4. render по состоянию: loading | empty | error | content
  return null;
}
```

## Чеклист сдачи

- [ ] Маршрут подключен
- [ ] Компоненты типизированы
- [ ] Моки отделены от UI
- [ ] Есть хотя бы одно непустое и одно пустое состояние (или пометка «отложено»)
- [ ] На мобильной ширине layout не ломается

## Анти-паттерны

- Гигантский `App.tsx` со всей логикой
- Копипаста одних и тех же карточек без общего компонента
- Фейковый «дизайн-системный» слой без реальных экранов
- Преждевременный Redux / микрофронты / SSR для прототипа

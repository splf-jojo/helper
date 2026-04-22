# Планер месяца (React + Tailwind)

## Запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
npm run preview
```

## Данные

Все данные читаются из одного файла:

- `data.json`

Структура:

- `subjects` - список предметов
- `plans` - список планов (дата, `subjectId`, тип, описание)

Полное имя предмета хранится в `subjects[*].subject`, а не внутри `plans`.

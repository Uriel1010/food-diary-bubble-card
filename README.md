# Food Diary Bubble Card

One UI-inspired nutrition summary card for Home Assistant Lovelace.

The card is built for Food Diary dashboards that expose daily nutrition sensors. It supports a full expanded view and a compact watch-friendly view with calories, daily progress, and macro/fiber gauges.

## Features

- Samsung One UI-inspired visual style
- RTL/Hebrew-friendly layout
- Expanded and compact density modes
- Compact calorie progress bar
- Compact partial-arc gauges for protein, carbs, fat, and fiber
- Section-level `more-info` actions
- Home Assistant visual editor support through `ha-form`
- YAML configuration support
- HACS custom repository support

## Installation With HACS

1. Open HACS in Home Assistant.
2. Open the three-dot menu.
3. Select **Custom repositories**.
4. Add this repository URL:

   ```text
   https://github.com/Uriel1010/food-diary-bubble-card
   ```

5. Select category **Dashboard**.
6. Install **Food Diary Bubble Card**.
7. Refresh the browser.
8. Add a Lovelace resource if HACS does not add it automatically:

   ```yaml
   url: /hacsfiles/food-diary-bubble-card/food-diary-bubble-card.js
   type: module
   ```

## Manual Installation

1. Copy `food-diary-bubble-card.js` to:

   ```text
   /config/www/food-diary-bubble-card/food-diary-bubble-card.js
   ```

2. Add this Lovelace resource:

   ```yaml
   url: /local/food-diary-bubble-card/food-diary-bubble-card.js
   type: module
   ```

3. Refresh the browser.

## Basic Configuration

```yaml
type: custom:food-diary-bubble-card
entity: sensor.food_diary_today_total_calories
density: normal
tap_action:
  action: more-info
calories_goal_min: 2000
calories_goal_max: 2400
goals:
  protein: 120
  carbs: 250
  fat: 80
  fiber: 30
```

## Compact Mode

```yaml
type: custom:food-diary-bubble-card
density: compact
calories_goal_min: 2000
calories_goal_max: 2400
goals:
  protein: 120
  carbs: 250
  fat: 80
  fiber: 30
```

Compact mode keeps the card around 142px high. Calories and the main progress bar are dominant, with four small 260-degree partial-arc gauges for protein, carbs, fat, and fiber.

## Default Entities

The card works out of the box with these entity IDs:

- `sensor.food_diary_today_total_calories`
- `sensor.food_diary_today_total_protein`
- `sensor.food_diary_today_total_carbs`
- `sensor.food_diary_today_total_fat`
- `sensor.food_diary_today_total_fiber`
- `sensor.food_diary_today_meal_count`
- `sensor.food_diary_current_streak_days`
- `sensor.food_diary_7_day_average_calories`
- `sensor.food_diary_14_day_average_calories`
- `sensor.food_diary_30_day_average_calories`
- `sensor.food_diary_latest_meal_title`
- `sensor.food_diary_latest_meal_calories`
- `sensor.food_diary_latest_meal_timestamp`

Override any entity under `entities:` if your sensor IDs differ.

```yaml
type: custom:food-diary-bubble-card
entities:
  calories: sensor.my_today_calories
  protein: sensor.my_today_protein
  carbs: sensor.my_today_carbs
  fat: sensor.my_today_fat
  fiber: sensor.my_today_fiber
  mealCount: sensor.my_today_meal_count
```

## Click Actions

When `tap_action.action` is `more-info`, each section opens the matching Home Assistant more-info dialog:

- Calories and calorie progress open the calories sensor
- Meal count opens the meal-count sensor
- Protein, carbs, fat, and fiber open their own sensors
- Expanded average tiles open their 7-, 14-, or 30-day average sensors
- Expanded latest meal opens the latest-meal title sensor

Disable card actions with:

```yaml
tap_action:
  action: none
```

## Visual Editor

The card supports the Home Assistant visual editor. Main settings can be configured without YAML:

- density
- tap action
- fallback entity
- calorie goal range
- protein, carbs, fat, and fiber goals
- all Food Diary sensor entities

## Requirements

- Home Assistant 2024.6 or newer
- A Food Diary integration or template sensors that expose compatible nutrition entities

This card is frontend-only. It does not store data and does not call external services.

## Development

Validate the JavaScript file:

```bash
node --check food-diary-bubble-card.js
```

## License

MIT

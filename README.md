# Food Diary Bubble Card

One UI-inspired nutrition summary card for Home Assistant Lovelace.

The card is built for Food Diary dashboards that expose daily nutrition sensors. It supports a full expanded view and a compact watch-friendly view with calories, daily progress, and macro/fiber gauges.

## Features

- Samsung One UI-inspired visual style
- RTL/Hebrew-friendly layout
- Expanded and compact density modes
- Compact calorie progress bar
- Compact partial-arc gauges for protein, carbs, fat, and fiber
- Expand/collapse control in compact mode
- Per-Home-Assistant-user entities, targets, and layout
- Targets can be fixed numbers or Home Assistant sensor entities
- Efficient state-based rendering for smoother mobile dashboards
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

## Per-user configuration

Use the Home Assistant user ID as the key under `users`. The card automatically
selects the matching entities and targets for the signed-in user, so a single
card can serve multiple users without leaving hidden-card gaps in the dashboard.

```yaml
type: custom:food-diary-bubble-card
density: compact
users:
  your_home_assistant_user_id:
    calories_goal_min: 1800
    calories_goal_max: 2000
    goals:
      protein: 140
      carbs: 250
      fat: 75
      fiber: 30
    entities:
      calories: sensor.healthconnect_nutrition_calories
      protein: sensor.healthconnect_nutrition_protein
      carbs: sensor.healthconnect_nutrition_carbs
      fat: sensor.healthconnect_nutrition_fat
      fiber: sensor.healthconnect_nutrition_fiber
      mealCount: sensor.healthconnect_nutrition_meal_count
```

Any value omitted from a user block falls back to the top-level configuration.

## Dynamic targets

Calorie and macro targets may reference numeric sensor entities instead of fixed
values. This lets the card follow targets managed by your integration:

```yaml
calories_goal_max: sensor.healthconnect_nutrition_calories_goal
goals:
  protein: sensor.healthconnect_nutrition_protein_goal
  carbs: sensor.healthconnect_nutrition_carbs_goal
  fat: sensor.healthconnect_nutrition_fat_goal
  fiber: sensor.healthconnect_nutrition_fiber_goal
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

class FoodDiaryBubbleCard extends HTMLElement {
  static getStubConfig() {
    return {
      type: "custom:food-diary-bubble-card",
      entity: "sensor.food_diary_today_total_calories",
      language: "he",
      density: "normal",
      calories_goal_min: 2000,
      calories_goal_max: 2400,
      goals: {
        protein: 120,
        carbs: 250,
        fat: 80,
        fiber: 30,
      },
    };
  }

  static getConfigElement() {
    return document.createElement("food-diary-bubble-card-editor");
  }

  setConfig(config) {
    this.config = {
      entity: "sensor.food_diary_today_total_calories",
      language: "he",
      density: "normal",
      calories_goal_min: 2000,
      calories_goal_max: 2400,
      goals: {
        protein: 120,
        carbs: 250,
        fat: 80,
        fiber: 30,
      },
      entities: {
        calories: "sensor.food_diary_today_total_calories",
        protein: "sensor.food_diary_today_total_protein",
        carbs: "sensor.food_diary_today_total_carbs",
        fat: "sensor.food_diary_today_total_fat",
        fiber: "sensor.food_diary_today_total_fiber",
        mealCount: "sensor.food_diary_today_meal_count",
        streak: "sensor.food_diary_current_streak_days",
        average7Calories: "sensor.food_diary_7_day_average_calories",
        average14Calories: "sensor.food_diary_14_day_average_calories",
        average30Calories: "sensor.food_diary_30_day_average_calories",
        latestTitle: "sensor.food_diary_latest_meal_title",
        latestCalories: "sensor.food_diary_latest_meal_calories",
        latestTimestamp: "sensor.food_diary_latest_meal_timestamp",
      },
      tap_action: {
        action: "more-info",
      },
      ...config,
      goals: {
        protein: 120,
        carbs: 250,
        fat: 80,
        fiber: 30,
        ...(config.goals || {}),
      },
      entities: {
        calories: "sensor.food_diary_today_total_calories",
        protein: "sensor.food_diary_today_total_protein",
        carbs: "sensor.food_diary_today_total_carbs",
        fat: "sensor.food_diary_today_total_fat",
        fiber: "sensor.food_diary_today_total_fiber",
        mealCount: "sensor.food_diary_today_meal_count",
        streak: "sensor.food_diary_current_streak_days",
        average7Calories: "sensor.food_diary_7_day_average_calories",
        average14Calories: "sensor.food_diary_14_day_average_calories",
        average30Calories: "sensor.food_diary_30_day_average_calories",
        latestTitle: "sensor.food_diary_latest_meal_title",
        latestCalories: "sensor.food_diary_latest_meal_calories",
        latestTimestamp: "sensor.food_diary_latest_meal_timestamp",
        ...(config.entities || {}),
      },
    };

    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
    }
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    this.render();
  }

  getCardSize() {
    if (this.config?.density === "compact") return 3;
    return 4;
  }

  render() {
    if (!this.shadowRoot || !this.config || !this._hass) return;

    const e = this.config.entities;
    const goals = this.config.goals;
    const calories = this.num(e.calories);
    const protein = this.num(e.protein);
    const carbs = this.num(e.carbs);
    const fat = this.num(e.fat);
    const fiber = this.num(e.fiber);
    const mealCount = this.num(e.mealCount);
    const streak = this.num(e.streak);
    const avg7 = this.num(e.average7Calories);
    const avg14 = this.num(e.average14Calories);
    const avg30 = this.num(e.average30Calories);
    const latestTitle = this.state(e.latestTitle);
    const latestCalories = this.num(e.latestCalories);
    const latestTimestamp = this.state(e.latestTimestamp);
    const goalMin = Number(this.config.calories_goal_min) || 2000;
    const goalMax = Number(this.config.calories_goal_max) || 2400;
    const kcalPct = this.percent(calories, goalMax);
    const status = this.calorieStatus(calories, goalMin, goalMax);
    const available = Number.isFinite(calories);
    const compact = this.config.density === "compact";

    this.shadowRoot.innerHTML = `
      <style>${this.styles()}</style>
      <ha-card
        role="button"
        tabindex="0"
        title="Open Food Diary details"
        aria-label="Open Food Diary details"
      >
        <article class="bubble-card ${compact ? "is-compact" : ""} ${available ? "" : "is-unavailable"}" dir="rtl">
          ${
            compact
              ? this.renderCompact({
                  available,
                  calories,
                  protein,
                  carbs,
                  fat,
                  fiber,
                  mealCount,
                  streak,
                  avg7,
                  latestTitle,
                  latestCalories,
                  goals,
                  entities: e,
                  goalMin,
                  goalMax,
                  kcalPct,
                  status,
                })
              : `
          <header class="header">
            <div class="identity">
              <div class="icon"><ha-icon icon="mdi:food-fork-drink"></ha-icon></div>
              <div class="heading">
                <div class="title">יומן אכילה</div>
                <div class="subtitle">${this.mealCountText(mealCount)}</div>
              </div>
            </div>
            <div class="chip" role="button" tabindex="0" data-more-info-entity="${this.escapeAttribute(e.streak)}" aria-label="Open streak details">
              <ha-icon icon="mdi:calendar-star"></ha-icon>
              <span>${this.streakText(streak)}</span>
            </div>
          </header>

          <section class="main-bubble">
            <div class="main-row">
              <div class="percent ${status.className}">${available ? `${Math.round(kcalPct)}%` : "—"}</div>
              <div class="kcal-wrap">
                <div class="kcal">${this.formatNumber(calories, 0)} <span>/ ${this.formatNumber(goalMax, 0)} kcal</span></div>
                <div class="remaining ${status.className}">${status.text}</div>
              </div>
            </div>
            ${this.progressBar(kcalPct, status.className)}
          </section>

          <section class="mini-row">
            ${this.mini("ממוצע 7 ימים", avg7, "kcal", e.average7Calories)}
            ${this.mini("14 יום", avg14, "kcal", e.average14Calories)}
            ${this.mini("30 יום", avg30, "kcal", e.average30Calories)}
          </section>

          <section class="macros">
            ${this.macro("חלבון", protein, goals.protein, "protein", "g", e.protein)}
            ${this.macro("פחמ׳", carbs, goals.carbs, "carbs", "g", e.carbs)}
            ${this.macro("שומן", fat, goals.fat, "fat", "g", e.fat)}
            ${this.macro("סיבים", fiber, goals.fiber, "fiber", "g", e.fiber)}
          </section>

          <section class="bottom" role="button" tabindex="0" data-more-info-entity="${this.escapeAttribute(e.latestTitle)}" aria-label="Open latest meal details">
            <span>אחרון:</span>
            <b>${this.cleanText(latestTitle) || "אין ארוחה אחרונה"}</b>
            ${Number.isFinite(latestCalories) ? `<span class="dot">·</span><span>${this.formatNumber(latestCalories, 0)} kcal</span>` : ""}
            ${latestTimestamp ? `<span class="dot">·</span><span>${this.formatTime(latestTimestamp)}</span>` : ""}
          </section>
          `
          }
        </article>
      </ha-card>
    `;

    const card = this.shadowRoot.querySelector("ha-card");
    card?.addEventListener("click", (event) => this.handleAction(event));
    card?.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.handleAction(event);
      }
    });
  }


  renderCompact({ available, calories, protein, carbs, fat, fiber, mealCount, streak, avg7, latestTitle, latestCalories, goals, entities, goalMin, goalMax, kcalPct, status }) {
    if (!available) {
      return `
        <div class="compact-empty">
          <div class="compact-title"><ha-icon icon="mdi:food"></ha-icon><span>יומן אכילה</span></div>
          <div class="compact-subtitle">נתונים לא זמינים</div>
        </div>
      `;
    }

    return `
      <header class="compact-top">
        <div class="compact-title">
          <ha-icon icon="mdi:food"></ha-icon>
          <span>יומן אכילה</span>
        </div>
        <div class="compact-meals" role="button" tabindex="0" data-more-info-entity="${this.escapeAttribute(entities.mealCount)}" aria-label="Open meal count details">${this.mealCountText(mealCount)}</div>
      </header>

      <section class="compact-calories" role="button" tabindex="0" data-more-info-entity="${this.escapeAttribute(entities.calories)}" aria-label="Open calories details">
        <div class="compact-kcal">
          <b>${this.formatNumber(calories, 0)}</b>
          <span>קלוריות</span>
        </div>
        <div class="compact-calorie-meta">
          <span class="compact-remaining ${status.className}">${this.compactCalorieStatus(calories, goalMin, goalMax)}</span>
          <span class="compact-goal">${Math.round(kcalPct)}% מהיעד · ${this.formatNumber(goalMax, 0)} קל׳</span>
        </div>
      </section>

      <div class="compact-calorie-progress" role="button" tabindex="0" data-more-info-entity="${this.escapeAttribute(entities.calories)}" aria-label="Open calorie progress details">
        ${this.progressBar(kcalPct, status.className)}
      </div>

      <section class="compact-gauges">
        ${this.compactGauge("חלבון", protein, goals.protein, "protein", entities.protein)}
        ${this.compactGauge("פחמימות", carbs, goals.carbs, "carbs", entities.carbs)}
        ${this.compactGauge("שומן", fat, goals.fat, "fat", entities.fat)}
        ${this.compactGauge("סיבים", fiber, goals.fiber, "fiber", entities.fiber)}
      </section>
    `;
  }


  compactGauge(label, value, goal, type, entityId) {
    const pct = this.percent(value, Number(goal));
    const arcDegrees = 260;
    const degrees = ((pct / 100) * arcDegrees).toFixed(1);
    return `
      <div class="compact-gauge compact-gauge-${type}" role="button" tabindex="0" data-more-info-entity="${this.escapeAttribute(entityId)}" aria-label="Open ${this.escapeAttribute(label)} details" style="--gauge:${degrees}deg; --arc:${arcDegrees}deg" title="${this.escapeAttribute(label)} ${this.formatNumber(value, 1)} / ${this.formatNumber(Number(goal), 0)}">
        <div class="compact-gauge-ring">
          <b>${this.formatNumber(value, 0)}</b>
        </div>
        <div class="compact-gauge-label">${label}</div>
      </div>
    `;
  }

  handleAction(event) {
    const action = this.config?.tap_action?.action || "more-info";
    if (action === "none") return;
    if (action !== "more-info") return;

    const entityId = this.moreInfoEntity(event);
    if (!entityId) return;

    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        bubbles: true,
        composed: true,
        detail: { entityId },
      })
    );
  }

  moreInfoEntity(event) {
    const targetEntity = event?.target?.closest?.("[data-more-info-entity]")?.dataset?.moreInfoEntity;
    return (
      targetEntity ||
      this.config?.tap_action?.entity ||
      this.config?.entity ||
      this.config?.entities?.calories ||
      "sensor.food_diary_today_total_calories"
    );
  }

  escapeAttribute(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  state(entityId) {
    const entity = this._hass?.states?.[entityId];
    if (!entity || ["unknown", "unavailable", "none", ""].includes(String(entity.state))) {
      return "";
    }
    return entity.state;
  }

  num(entityId) {
    const value = Number.parseFloat(this.state(entityId));
    return Number.isFinite(value) ? value : NaN;
  }

  percent(value, goal) {
    if (!Number.isFinite(value) || !Number.isFinite(goal) || goal <= 0) return 0;
    return Math.max(0, Math.min((value / goal) * 100, 100));
  }

  calorieStatus(value, min, max) {
    if (!Number.isFinite(value)) {
      return { className: "muted", text: "נתונים לא זמינים" };
    }
    if (value < min) {
      return {
        className: value < min * 0.55 ? "low" : "warn",
        text: `נותרו ${this.formatNumber(min - value, 0)} kcal לטווח`,
      };
    }
    if (value <= max) {
      return { className: "good", text: "בתוך הטווח היומי" };
    }
    return {
      className: "over",
      text: `מעל הטווח ב-${this.formatNumber(value - max, 0)} kcal`,
    };
  }

  compactCalorieStatus(value, min, max) {
    if (!Number.isFinite(value)) return "נתונים לא זמינים";
    if (value < min) return `נותרו ${this.formatNumber(min - value, 0)} קל׳`;
    if (value <= max) return "בתוך הטווח";
    return `מעל ב-${this.formatNumber(value - max, 0)} קל׳`;
  }

  mealCountText(value) {
    if (!Number.isFinite(value)) return "אין נתוני ארוחות";
    const count = Math.round(value);
    return `${count} ${count === 1 ? "ארוחה" : "ארוחות"} היום`;
  }

  streakText(value) {
    if (!Number.isFinite(value)) return "רצף לא זמין";
    return `${Math.round(value)} ימים`;
  }

  mini(label, value, unit, entityId) {
    const moreInfoEntity = this.escapeAttribute(entityId || "");
    return `
      <div class="mini" role="button" tabindex="0" data-more-info-entity="${moreInfoEntity}" aria-label="Open ${this.escapeAttribute(label)} details">
        <small>${label}</small>
        <b>${this.formatNumber(value, 0)} <span>${unit}</span></b>
      </div>
    `;
  }

  macro(label, value, goal, type, unit, entityId) {
    const pct = this.percent(value, Number(goal));
    const moreInfoEntity = this.escapeAttribute(entityId || "");
    return `
      <div class="macro macro-${type}" role="button" tabindex="0" data-more-info-entity="${moreInfoEntity}" aria-label="Open ${this.escapeAttribute(label)} details">
        <div class="macro-name">${label}</div>
        ${this.progressBar(pct, type)}
        <div class="macro-val"><b>${this.formatNumber(value, 1)}</b>/${this.formatNumber(Number(goal), 0)}${unit}</div>
      </div>
    `;
  }

  progressBar(percent, className) {
    const width = Math.max(0, Math.min(percent, 100)).toFixed(1);
    return `<div class="bar ${className}" style="--w:${width}%"><i></i></div>`;
  }

  cleanText(value) {
    return String(value || "").trim();
  }

  formatNumber(value, digits = 0) {
    if (!Number.isFinite(value)) return "—";
    return new Intl.NumberFormat("he-IL", {
      maximumFractionDigits: digits,
      minimumFractionDigits: digits,
    }).format(value);
  }

  formatTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  styles() {
    return `
      :host {
        display: block;
        --fd-bg: #14191f;
        --fd-panel: rgba(255, 255, 255, 0.055);
        --fd-panel-soft: rgba(255, 255, 255, 0.042);
        --fd-border: rgba(255, 255, 255, 0.08);
        --fd-text: #f8fafc;
        --fd-muted: #94a3b8;
        --fd-soft: #cbd5e1;
        --fd-good: #72d572;
        --fd-low: #38bdf8;
        --fd-warn: #fbbf24;
        --fd-over: #fb7185;
        --fd-protein: #60a5fa;
        --fd-carbs: #f59e0b;
        --fd-fat: #a78bfa;
        --fd-fiber: #4ade80;
      }

      ha-card {
        background: transparent;
        box-shadow: none;
        border: 0;
      }

      ha-card[role="button"] {
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
      }

      ha-card[role="button"]:focus-visible .bubble-card {
        outline: 2px solid rgba(134, 239, 172, 0.78);
        outline-offset: 2px;
      }

      ha-card[role="button"]:active .bubble-card {
        transform: scale(0.992);
      }

      @media (hover: hover) {
        ha-card[role="button"]:hover .bubble-card {
          border-color: rgba(134, 239, 172, 0.24);
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.34), 0 0 0 1px rgba(134, 239, 172, 0.08);
        }
      }

      * {
        box-sizing: border-box;
      }

      .bubble-card {
        width: 100%;
        max-width: var(--food-diary-card-max-width, none);
        margin: 0;
        padding: 12px;
        border-radius: 28px;
        color: var(--fd-text);
        background:
          radial-gradient(circle at 18% 0%, rgba(74, 222, 128, 0.13), transparent 30%),
          linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent 32%),
          var(--fd-bg);
        border: 1px solid var(--fd-border);
        box-shadow: 0 18px 45px rgba(0, 0, 0, 0.34);
        font-family: var(--paper-font-body1_-_font-family, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif);
        overflow: hidden;
        transition: transform 120ms ease, border-color 120ms ease, box-shadow 120ms ease;
      }

      .is-unavailable {
        opacity: 0.72;
      }
      .bubble-card.is-compact {
        position: relative;
        min-height: 142px;
        height: 142px;
        padding: 9px 16px 8px;
        border-radius: var(--oneui-weather-card-radius, 28px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 5px;
        background:
          radial-gradient(ellipse at 86% 112%, rgba(117, 190, 132, 0.26), transparent 50%),
          linear-gradient(132deg, #20262b 0%, #33403b 54%, #536356 100%);
        border-color: rgba(255, 255, 255, 0.075);
        box-shadow: none;
        isolation: isolate;
      }

      .bubble-card.is-compact::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        border-radius: inherit;
        pointer-events: none;
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.12), transparent 34%),
          radial-gradient(ellipse at 50% 122%, transparent 30%, rgba(2, 8, 20, 0.18) 100%);
        box-shadow:
          inset 0 1px rgba(255, 255, 255, 0.12),
          inset 0 -1px rgba(0, 0, 0, 0.10);
        opacity: 0.76;
      }

      .compact-top,
      .compact-calories,
      .compact-gauges {
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 0;
      }

      .compact-top {
        gap: 10px;
        min-height: 18px;
      }

      .compact-title {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        min-width: 0;
        color: rgba(255, 255, 255, 0.86);
        font-size: 12.5px;
        font-weight: 650;
        line-height: 1.1;
        white-space: nowrap;
      }

      .compact-title ha-icon {
        --mdc-icon-size: 17px;
        color: rgba(255, 255, 255, 0.82);
      }

      .compact-meals {
        min-width: 0;
        color: rgba(255, 255, 255, 0.54);
        font-size: 10.5px;
        font-weight: 520;
        line-height: 1.1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .compact-calories {
        gap: 12px;
        align-items: flex-end;
        min-height: 37px;
      }

      .compact-kcal {
        direction: rtl;
        display: flex;
        align-items: baseline;
        gap: 6px;
        min-width: 0;
      }

      .compact-kcal b {
        direction: ltr;
        color: rgba(255, 255, 255, 0.98);
        font-size: 35px;
        line-height: 0.9;
        font-weight: 520;
        letter-spacing: 0;
      }

      .compact-kcal span {
        color: rgba(255, 255, 255, 0.62);
        font-size: 11.5px;
        font-weight: 620;
      }

      .compact-calorie-meta {
        min-width: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
        padding-bottom: 2px;
        direction: rtl;
        text-align: right;
      }

      .compact-remaining {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 11.5px;
        font-weight: 650;
        line-height: 1.15;
      }

      .compact-goal {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        color: rgba(255, 255, 255, 0.48);
        font-size: 10px;
        font-weight: 520;
        line-height: 1.1;
        white-space: nowrap;
      }

      .compact-calorie-progress .bar {
        height: 7px;
        border-radius: 999px;
        background: rgba(0, 0, 0, 0.16);
        box-shadow: inset 0 1px rgba(255, 255, 255, 0.08);
      }

      .compact-calorie-progress .bar > i {
        box-shadow:
          inset 0 1px rgba(255, 255, 255, 0.22),
          0 2px 8px rgba(134, 239, 172, 0.15);
      }

      .compact-gauges {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 7px;
        direction: rtl;
        padding-top: 0;
      }

      .compact-gauge {
        --gauge-color: rgba(255, 255, 255, 0.72);
        min-width: 0;
        display: grid;
        justify-items: center;
        gap: 3px;
      }

      .compact-meals[role="button"],
      .compact-calories[role="button"],
      .compact-calorie-progress[role="button"],
      .compact-gauge[role="button"] {
        cursor: pointer;
        border-radius: 14px;
      }

      .compact-meals[role="button"]:focus-visible,
      .compact-calories[role="button"]:focus-visible,
      .compact-calorie-progress[role="button"]:focus-visible,
      .compact-gauge[role="button"]:focus-visible {
        outline: 2px solid rgba(255, 255, 255, 0.54);
        outline-offset: 2px;
      }

      @media (hover: hover) {
        .compact-gauge[role="button"]:hover .compact-gauge-ring {
          background:
            radial-gradient(circle at center, rgba(42, 50, 47, 0.94) 0 60%, transparent 62%),
            conic-gradient(from 230deg, var(--gauge-color) 0 var(--gauge), rgba(255, 255, 255, 0.20) var(--gauge) var(--arc), transparent var(--arc) 360deg);
        }

        .compact-calories[role="button"]:hover,
        .compact-meals[role="button"]:hover {
          filter: brightness(1.06);
        }
      }

      .compact-gauge-protein { --gauge-color: #a9c9ff; }
      .compact-gauge-carbs { --gauge-color: #f4cf94; }
      .compact-gauge-fat { --gauge-color: #c9bbff; }
      .compact-gauge-fiber { --gauge-color: #abe7ba; }

      .compact-gauge-ring {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background:
          radial-gradient(circle at center, rgba(36, 43, 40, 0.92) 0 60%, transparent 62%),
          conic-gradient(from 230deg, var(--gauge-color) 0 var(--gauge), rgba(255, 255, 255, 0.16) var(--gauge) var(--arc), transparent var(--arc) 360deg);
        box-shadow:
          inset 0 1px rgba(255, 255, 255, 0.08),
          0 2px 7px rgba(0, 0, 0, 0.08);
      }

      .compact-gauge-ring b {
        color: rgba(255, 255, 255, 0.96);
        font-size: 11.5px;
        font-weight: 650;
        line-height: 1;
        transform: translateY(-1px);
      }

      .compact-gauge-label {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: rgba(255, 255, 255, 0.60);
        font-size: 9.5px;
        font-weight: 560;
        line-height: 1;
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 10px;
      }

      .identity {
        min-width: 0;
        display: flex;
        align-items: center;
        gap: 9px;
      }

      .icon {
        width: 36px;
        height: 36px;
        border-radius: 999px;
        display: grid;
        place-items: center;
        flex: 0 0 auto;
        background: rgba(34, 197, 94, 0.14);
        color: #86efac;
      }

      .icon ha-icon {
        --mdc-icon-size: 20px;
      }

      .heading {
        min-width: 0;
      }

      .title {
        font-size: 16px;
        font-weight: 760;
        line-height: 1.15;
      }

      .subtitle {
        margin-top: 2px;
        font-size: 12px;
        color: var(--fd-muted);
      }

      .chip {
        min-height: 30px;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        border-radius: 999px;
        padding: 6px 10px;
        background: rgba(251, 146, 60, 0.12);
        color: #fdba74;
        border: 1px solid rgba(251, 146, 60, 0.16);
        font-size: 12px;
        font-weight: 700;
        white-space: nowrap;
      }

      .chip ha-icon {
        --mdc-icon-size: 15px;
      }

      .chip[role="button"] {
        cursor: pointer;
      }

      .chip[role="button"]:focus-visible {
        outline: 2px solid rgba(253, 186, 116, 0.72);
        outline-offset: 2px;
      }

      .main-bubble {
        margin-bottom: 8px;
        padding: 13px;
        border-radius: 24px;
        background: var(--fd-panel);
      }

      .main-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 12px;
        margin-bottom: 9px;
      }

      .kcal-wrap {
        min-width: 0;
        text-align: left;
        direction: ltr;
      }

      .kcal {
        font-size: clamp(24px, 7vw, 29px);
        font-weight: 800;
        letter-spacing: 0;
        line-height: 1;
        white-space: nowrap;
      }

      .kcal span {
        color: #aab2bf;
        font-size: 14px;
        font-weight: 560;
      }

      .percent {
        font-size: 18px;
        font-weight: 800;
        line-height: 1;
        white-space: nowrap;
      }

      .remaining {
        margin-top: 5px;
        color: var(--fd-muted);
        font-size: 12px;
        direction: rtl;
        text-align: left;
      }

      .good { color: var(--fd-good); }
      .low { color: var(--fd-low); }
      .warn { color: var(--fd-warn); }
      .over { color: var(--fd-over); }
      .muted { color: var(--fd-muted); }

      .bar {
        height: 7px;
        border-radius: 999px;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.10);
      }

      .bar > i {
        display: block;
        width: var(--w);
        max-width: 100%;
        height: 100%;
        border-radius: 999px;
        background: currentColor;
      }

      .bar.good,
      .bar.low,
      .bar.warn,
      .bar.over {
        color: currentColor;
      }

      .bar.good > i { background: var(--fd-good); }
      .bar.low > i { background: var(--fd-low); }
      .bar.warn > i { background: var(--fd-warn); }
      .bar.over > i { background: var(--fd-over); }
      .bar.protein > i { background: var(--fd-protein); }
      .bar.carbs > i { background: var(--fd-carbs); }
      .bar.fat > i { background: var(--fd-fat); }
      .bar.fiber > i { background: var(--fd-fiber); }

      .mini-row {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 7px;
        margin-bottom: 8px;
      }

      .mini {
        min-width: 0;
        border-radius: 18px;
        padding: 9px 8px;
        background: var(--fd-panel-soft);
      }

      .mini[role="button"] {
        cursor: pointer;
        transition: background 120ms ease, box-shadow 120ms ease;
      }

      .mini[role="button"]:focus-visible {
        outline: 2px solid rgba(134, 239, 172, 0.72);
        outline-offset: 2px;
      }

      .mini small {
        display: block;
        margin-bottom: 3px;
        color: var(--fd-muted);
        font-size: 11px;
        line-height: 1.15;
      }

      .mini b {
        display: block;
        direction: ltr;
        text-align: right;
        font-size: 14px;
        font-weight: 760;
        white-space: nowrap;
      }

      .mini span {
        color: var(--fd-muted);
        font-size: 11px;
        font-weight: 600;
      }

      .macros {
        display: grid;
        gap: 7px;
      }

      .macro {
        display: grid;
        grid-template-columns: 52px minmax(0, 1fr) 76px;
        align-items: center;
        gap: 8px;
        border-radius: 18px;
        padding: 9px 10px;
        background: var(--fd-panel-soft);
      }

      .macro[role="button"] {
        cursor: pointer;
        transition: background 120ms ease, box-shadow 120ms ease;
      }

      .macro[role="button"]:focus-visible {
        outline: 2px solid rgba(134, 239, 172, 0.72);
        outline-offset: 2px;
      }

      @media (hover: hover) {
        .mini[role="button"]:hover,
        .macro[role="button"]:hover,
        .bottom[role="button"]:hover {
          background: rgba(255, 255, 255, 0.07);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.055);
        }

        .chip[role="button"]:hover {
          border-color: rgba(253, 186, 116, 0.32);
          background: rgba(251, 146, 60, 0.16);
        }
      }

      .macro-name {
        color: #e5e7eb;
        font-size: 13px;
        font-weight: 750;
      }

      .macro-val {
        direction: ltr;
        text-align: left;
        color: var(--fd-soft);
        font-size: 12px;
        white-space: nowrap;
      }

      .macro-val b {
        color: var(--fd-text);
        font-size: 13px;
        font-weight: 780;
      }

      .macro-protein .macro-name { color: #bfdbfe; }
      .macro-carbs .macro-name { color: #fed7aa; }
      .macro-fat .macro-name { color: #ddd6fe; }
      .macro-fiber .macro-name { color: #bbf7d0; }

      .bottom {
        margin-top: 8px;
        border-radius: 20px;
        padding: 10px 11px;
        background: rgba(255, 255, 255, 0.04);
        color: var(--fd-muted);
        font-size: 12px;
        line-height: 1.45;
        overflow-wrap: anywhere;
      }

      .bottom[role="button"] {
        cursor: pointer;
        transition: background 120ms ease, box-shadow 120ms ease;
      }

      .bottom[role="button"]:focus-visible {
        outline: 2px solid rgba(134, 239, 172, 0.72);
        outline-offset: 2px;
      }

      .bottom b {
        color: var(--fd-text);
        font-weight: 720;
      }

      .dot {
        padding: 0 4px;
        color: rgba(148, 163, 184, 0.75);
      }

      @media (max-width: 370px) {
        .bubble-card {
          border-radius: 24px;
          padding: 10px;
        }

        .mini-row {
          grid-template-columns: 1fr 1fr;
        }

        .macro {
          grid-template-columns: 48px minmax(0, 1fr) 70px;
        }

        .chip {
          padding-inline: 8px;
        }
      }
    `;
  }
}


let foodDiaryEditorDependenciesPromise;

async function ensureFoodDiaryEditorDependencies() {
  if (customElements.get("ha-form")) return;
  if (!foodDiaryEditorDependenciesPromise) {
    foodDiaryEditorDependenciesPromise = (async () => {
      if (typeof window.loadCardHelpers !== "function") return;
      try {
        const helpers = await window.loadCardHelpers();
        const card = await helpers.createCardElement({ type: "button" });
        await card.constructor.getConfigElement?.();
      } catch (error) {
        console.warn("Food Diary Bubble Card could not preload editor components.", error);
      }
    })();
  }
  await foodDiaryEditorDependenciesPromise;
}

class FoodDiaryBubbleCardEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.handleValueChanged = this.handleValueChanged.bind(this);
    this.computeLabel = this.computeLabel.bind(this);
    this.computeHelper = this.computeHelper.bind(this);
  }

  setConfig(config) {
    this._config = this.withDefaults(config || {});
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    const form = this.shadowRoot?.querySelector("ha-form");
    if (form) form.hass = hass;
    else this.render();
  }

  connectedCallback() {
    ensureFoodDiaryEditorDependencies().then(() => this.render());
  }

  withDefaults(config) {
    return {
      type: "custom:food-diary-bubble-card",
      entity: "sensor.food_diary_today_total_calories",
      language: "he",
      density: "normal",
      calories_goal_min: 2000,
      calories_goal_max: 2400,
      tap_action: { action: "more-info" },
      ...config,
      goals: {
        protein: 120,
        carbs: 250,
        fat: 80,
        fiber: 30,
        ...(config.goals || {}),
      },
      entities: {
        calories: "sensor.food_diary_today_total_calories",
        protein: "sensor.food_diary_today_total_protein",
        carbs: "sensor.food_diary_today_total_carbs",
        fat: "sensor.food_diary_today_total_fat",
        fiber: "sensor.food_diary_today_total_fiber",
        mealCount: "sensor.food_diary_today_meal_count",
        streak: "sensor.food_diary_current_streak_days",
        average7Calories: "sensor.food_diary_7_day_average_calories",
        average14Calories: "sensor.food_diary_14_day_average_calories",
        average30Calories: "sensor.food_diary_30_day_average_calories",
        latestTitle: "sensor.food_diary_latest_meal_title",
        latestCalories: "sensor.food_diary_latest_meal_calories",
        latestTimestamp: "sensor.food_diary_latest_meal_timestamp",
        ...(config.entities || {}),
      },
      tap_action: {
        action: "more-info",
        ...(config.tap_action || {}),
      },
    };
  }

  schema() {
    return [
      {
        name: "layout",
        type: "expandable",
        title: "Layout",
        flatten: true,
        expanded: true,
        schema: [
          {
            name: "density",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  { value: "normal", label: "Normal" },
                  { value: "compact", label: "Compact" },
                ],
              },
            },
          },
          {
            name: "language",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  { value: "he", label: "Hebrew" },
                  { value: "en", label: "English" },
                ],
              },
            },
          },
          {
            name: "tap_action_action",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  { value: "more-info", label: "More info" },
                  { value: "none", label: "None" },
                ],
              },
            },
          },
          { name: "entity", selector: { entity: {} } },
        ],
      },
      {
        name: "targets",
        type: "expandable",
        title: "Targets",
        flatten: true,
        expanded: true,
        schema: [
          {
            name: "",
            type: "grid",
            flatten: true,
            column_min_width: "140px",
            schema: [
              { name: "calories_goal_min", selector: { number: { mode: "box", min: 0, step: 1, unit_of_measurement: "kcal" } } },
              { name: "calories_goal_max", selector: { number: { mode: "box", min: 1, step: 1, unit_of_measurement: "kcal" } } },
              { name: "goal_protein", selector: { number: { mode: "box", min: 0, step: 1, unit_of_measurement: "g" } } },
              { name: "goal_carbs", selector: { number: { mode: "box", min: 0, step: 1, unit_of_measurement: "g" } } },
              { name: "goal_fat", selector: { number: { mode: "box", min: 0, step: 1, unit_of_measurement: "g" } } },
              { name: "goal_fiber", selector: { number: { mode: "box", min: 0, step: 1, unit_of_measurement: "g" } } },
            ],
          },
        ],
      },
      {
        name: "entities",
        type: "expandable",
        title: "Entities",
        flatten: true,
        expanded: false,
        schema: [
          {
            name: "",
            type: "grid",
            flatten: true,
            column_min_width: "180px",
            schema: [
              { name: "entity_calories", selector: { entity: { filter: { domain: "sensor" } } } },
              { name: "entity_protein", selector: { entity: { filter: { domain: "sensor" } } } },
              { name: "entity_carbs", selector: { entity: { filter: { domain: "sensor" } } } },
              { name: "entity_fat", selector: { entity: { filter: { domain: "sensor" } } } },
              { name: "entity_fiber", selector: { entity: { filter: { domain: "sensor" } } } },
              { name: "entity_mealCount", selector: { entity: { filter: { domain: "sensor" } } } },
              { name: "entity_streak", selector: { entity: { filter: { domain: "sensor" } } } },
              { name: "entity_average7Calories", selector: { entity: { filter: { domain: "sensor" } } } },
              { name: "entity_average14Calories", selector: { entity: { filter: { domain: "sensor" } } } },
              { name: "entity_average30Calories", selector: { entity: { filter: { domain: "sensor" } } } },
              { name: "entity_latestTitle", selector: { entity: { filter: { domain: "sensor" } } } },
              { name: "entity_latestCalories", selector: { entity: { filter: { domain: "sensor" } } } },
              { name: "entity_latestTimestamp", selector: { entity: { filter: { domain: "sensor" } } } },
            ],
          },
        ],
      },
    ];
  }

  editorData() {
    const config = this.withDefaults(this._config || {});
    return {
      type: config.type,
      entity: config.entity || "",
      density: config.density || "normal",
      language: config.language || "he",
      tap_action_action: config.tap_action?.action || "more-info",
      calories_goal_min: config.calories_goal_min,
      calories_goal_max: config.calories_goal_max,
      goal_protein: config.goals.protein,
      goal_carbs: config.goals.carbs,
      goal_fat: config.goals.fat,
      goal_fiber: config.goals.fiber,
      entity_calories: config.entities.calories,
      entity_protein: config.entities.protein,
      entity_carbs: config.entities.carbs,
      entity_fat: config.entities.fat,
      entity_fiber: config.entities.fiber,
      entity_mealCount: config.entities.mealCount,
      entity_streak: config.entities.streak,
      entity_average7Calories: config.entities.average7Calories,
      entity_average14Calories: config.entities.average14Calories,
      entity_average30Calories: config.entities.average30Calories,
      entity_latestTitle: config.entities.latestTitle,
      entity_latestCalories: config.entities.latestCalories,
      entity_latestTimestamp: config.entities.latestTimestamp,
    };
  }

  configFromEditorData(data) {
    return this.withDefaults({
      type: "custom:food-diary-bubble-card",
      entity: data.entity || "sensor.food_diary_today_total_calories",
      density: data.density || "normal",
      language: data.language || "he",
      calories_goal_min: this.positiveNumber(data.calories_goal_min, 2000, 0),
      calories_goal_max: this.positiveNumber(data.calories_goal_max, 2400, 1),
      goals: {
        protein: this.positiveNumber(data.goal_protein, 120, 0),
        carbs: this.positiveNumber(data.goal_carbs, 250, 0),
        fat: this.positiveNumber(data.goal_fat, 80, 0),
        fiber: this.positiveNumber(data.goal_fiber, 30, 0),
      },
      entities: {
        calories: data.entity_calories || "sensor.food_diary_today_total_calories",
        protein: data.entity_protein || "sensor.food_diary_today_total_protein",
        carbs: data.entity_carbs || "sensor.food_diary_today_total_carbs",
        fat: data.entity_fat || "sensor.food_diary_today_total_fat",
        fiber: data.entity_fiber || "sensor.food_diary_today_total_fiber",
        mealCount: data.entity_mealCount || "sensor.food_diary_today_meal_count",
        streak: data.entity_streak || "sensor.food_diary_current_streak_days",
        average7Calories: data.entity_average7Calories || "sensor.food_diary_7_day_average_calories",
        average14Calories: data.entity_average14Calories || "sensor.food_diary_14_day_average_calories",
        average30Calories: data.entity_average30Calories || "sensor.food_diary_30_day_average_calories",
        latestTitle: data.entity_latestTitle || "sensor.food_diary_latest_meal_title",
        latestCalories: data.entity_latestCalories || "sensor.food_diary_latest_meal_calories",
        latestTimestamp: data.entity_latestTimestamp || "sensor.food_diary_latest_meal_timestamp",
      },
      tap_action: { action: data.tap_action_action || "more-info" },
    });
  }

  positiveNumber(value, fallback, min) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.max(min, number);
  }

  render() {
    if (!this.shadowRoot || !this._config || !this._hass || !customElements.get("ha-form")) return;
    this.shadowRoot.innerHTML = `
      <style>
        :host, ha-form {
          display: block;
          box-sizing: border-box;
          min-width: 0;
          max-width: 100%;
        }
      </style>
      <ha-form></ha-form>
    `;
    const form = this.shadowRoot.querySelector("ha-form");
    form.hass = this._hass;
    form.data = this.editorData();
    form.schema = this.schema();
    form.computeLabel = this.computeLabel;
    form.computeHelper = this.computeHelper;
    form.addEventListener("value-changed", this.handleValueChanged);
  }

  handleValueChanged(event) {
    event.stopPropagation();
    if (!event.detail?.value) return;
    const next = this.configFromEditorData(event.detail.value);
    this._config = next;
    this.dispatchEvent(new CustomEvent("config-changed", {
      bubbles: true,
      composed: true,
      detail: { config: next },
    }));
  }

  computeLabel(schema) {
    const labels = {
      calories_goal_max: "Calorie goal max",
      calories_goal_min: "Calorie goal min",
      density: "Density",
      entity: "Fallback entity",
      language: "Language",
      layout: "Layout",
      targets: "Targets",
      entities: "Entities",
      tap_action_action: "Tap action",
      goal_protein: "Protein goal",
      goal_carbs: "Carbs goal",
      goal_fat: "Fat goal",
      goal_fiber: "Fiber goal",
      entity_calories: "Calories sensor",
      entity_protein: "Protein sensor",
      entity_carbs: "Carbs sensor",
      entity_fat: "Fat sensor",
      entity_fiber: "Fiber sensor",
      entity_mealCount: "Meal count sensor",
      entity_streak: "Streak sensor",
      entity_average7Calories: "7-day calories sensor",
      entity_average14Calories: "14-day calories sensor",
      entity_average30Calories: "30-day calories sensor",
      entity_latestTitle: "Latest meal title sensor",
      entity_latestCalories: "Latest meal calories sensor",
      entity_latestTimestamp: "Latest meal timestamp sensor",
    };
    return labels[schema.name] || schema.name || "";
  }

  computeHelper(schema) {
    const helpers = {
      entity: "Used when tapping an area without a specific sensor target.",
      tap_action_action: "Section taps open the matching sensor in more-info when enabled.",
      density: "Normal keeps the expanded card. Compact uses the watch-friendly One UI layout.",
      targets: "Goals are used for the calorie bar and macro/fiber gauges only.",
      entities: "Each compact section can open its mapped sensor with more-info.",
    };
    return helpers[schema.name];
  }
}
if (!customElements.get("food-diary-bubble-card")) {
  customElements.define("food-diary-bubble-card", FoodDiaryBubbleCard);
}

if (!customElements.get("food-diary-bubble-card-editor")) {
  customElements.define("food-diary-bubble-card-editor", FoodDiaryBubbleCardEditor);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "food-diary-bubble-card",
  name: "Food Diary Bubble Card",
  description: "Bubble-style Food Diary summary card for Home Assistant.",
  preview: true,
});

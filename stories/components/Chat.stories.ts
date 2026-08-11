// ==========================================================================
// Stylescape | Storybook — Chat
// ==========================================================================
// Auto-generated from src/jinja/31-modules/chat.html.jinja.
// Regenerate with `npm run generate:stories` (do not edit by hand).
// ==========================================================================

import type { Meta, StoryObj } from "@storybook/html-vite";
import { html } from "../html";

const meta: Meta = {
    title: "Components/Chat",
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Example: Story = {
    render: () => html`
        <section class="ss-c-bodychat_1">
          <div class="ss-c-theme_chat_left_1">
            <p class="ss-c-chat-message_left">Hello! How can I help you today?</p>
            <p class="ss-c-chat_time_1">10:00 AM</p>
            <p class="ss-c-chat_name_1">Donald D</p>
          </div>

          <div class="ss-c-theme_chat_right_1">
            <p class="ss-c-chat-message">Hi! I have a quick question about my order.</p>
            <p class="ss-c-chat_time_1">10:01 AM</p>
            <p class="ss-c-chat_name_2">John Bravo</p>
          </div>

          <div class="ss-c-theme_chat_left_1">
            <p class="ss-c-chat-message_left">Sure, what seems to be the issue?</p>
            <p class="ss-c-chat_time_1">10:02 AM</p>
            <p class="ss-c-chat_name_1">Donald D</p>
          </div>

          <div class="ss-c-theme_chat_right_1">
            <p class="ss-c-chat-message">I haven’t received a confirmation email yet.</p>
            <p class="ss-c-chat_time_1">10:03 AM</p>
            <p class="ss-c-chat_name_2">John Bravo</p>
          </div>

          <input type="text" class="ss-c-chat-input_delta" placeholder="Type your message here..." />
        </section>

        <section class="ss-c-themechat_2">
          <div class="ss-c-theme_chat_left_2">
            <p class="ss-c-chat-message_left">Hello! How can I help you today?</p>
            <p class="ss-c-chat_time_3">02:00 AM</p>
            <p class="ss-c-chat_name_3">Donald</p>
          </div>

          <div class="ss-c-theme_chat_right_2">
            <p class="ss-c-chat-message">Hi! I have a quick question about my order.</p>
            <p class="ss-c-chat_time_4">03:01 AM</p>
            <p class="ss-c-chat_name_4">Mark</p>
          </div>

          <div class="ss-c-theme_chat_left_2">
            <p class="ss-c-chat-message_left">Sure, what seems to be the issue?</p>
            <p class="ss-c-chat_time_3">03:02 AM</p>
            <p class="ss-c-chat_name_3">Donald</p>
          </div>

          <div class="ss-c-theme_chat_right_2">
            <p class="ss-c-chat-message">I haven’t received a confirmation email yet.</p>
            <p class="ss-c-chat_time_4">03:03 AM</p>
            <p class="ss-c-chat_name_4">Mark</p>
          </div>

          <input type="text" class="ss-c-chat-input_alpha" placeholder="Type your message here..." />
        </section>

        <section class="ss-c-themechat_3">

          <div class="ss-c-theme_chat leftright" data-chat-message="">
            <p class="ss-c-chat_message"></p>
            <p class="ss-c-chat_time"></p>
            <p class="ss-c-chat_name"></p>
          </div>

        </section>

        <section class="ss-c-themechat_4">

          <div class="ss-c-theme_chat_4 leftright" data-chat-message="">
            <p class="ss-c-chat_message"></p>
            <p class="ss-c-chat_time"></p>
            <p class="ss-c-chat_name"></p>
          </div>

        <input type="text" class="ss-c-chat-input_alpha" placeholder="Type your message here..." />
        </section>

        <section class="ss-c-workingsection">
          <header class="ss-c-workingsection_header">
            <h2 class="ss-c-workingsection_title">Working Section</h2>
          </header>
          <ol class="ss-c-workingsection_list">

            <li></li>

          </ol>
        </section>

        <section class="ss-c-avatar_indicators_body">
          <header class="ss-c-avatar_indicators_header">
            <h2 class="ss-c-avatar_indicators_title">Avatar Indicators</h2>
          </header>
          <div class="ss-c-avatar_indicators_example">
            <div class="ss-c-placeholder_indicator"></div>
          </div>
          <div class="ss-c-avatarsbody">
            <div class="ss-c-avatar_indicator ss-c-online"></div>
            <div class="ss-c-avatar_indicator ss-c-offline"></div>
            <div class="ss-c-avatar_indicator ss-c-busy"></div>
            <div class="ss-c-avatar_indicator ss-c-away"></div>
          </div>
        </section>

        <section class="ss-c-swap_icons_body">
        <header class="ss-c-swaps_icon_header">
            <h2 class="ss-c-swaps_icon_title">Swap icons</h2>
        </header>

        <button class="ss-c-icon_swap" aria-label="Toggle">
          <span class="ss-c-irobin ss-c-icon_a">⟳</span>
          <span class="ss-c-irobin ss-c-icon_b">✓</span>
        </button>

        <script>
          document.querySelector('.icon_swap')
            .addEventListener('click', function () {
              this.classList.toggle('is-active'); // keep hyphen
            });
        </script>
        </section>

        <section class="ss-c-speed_dial_robin">
          <header class="ss-c-speed_dial_robin_header">
            <h2 class="ss-c-speed_dial_robin_title">Swap icons</h2>
          </header>
          <div class="ss-c-fab-wrap" data-fab>
            <!-- Main FAB -->

            <button class="ss-c-fab" type="button" aria-label="Open actions" data-fab-toggle>
              <span class="ss-c-fab__icon ss-c-fab__icon--open" aria-hidden="true">
                <!-- SVG placeholder -->

                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </span>

              <span class="ss-c-fab__icon ss-c-fab__icon--close" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </span>
            </button>

            <!-- Flower actions -->
            <div class="ss-c-flower" aria-label="Quick actions">
              <button class="ss-c-petal" type="button" aria-label="Action 1">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="2" />
                </svg>
              </button>

              <button class="ss-c-petal" type="button" aria-label="Action 2">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M12 4l6 16H6z" fill="none" stroke="currentColor" stroke-width="2" />
                </svg>
              </button>

              <button class="ss-c-petal" type="button" aria-label="Action 3">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </button>

              <button class="ss-c-petal" type="button" aria-label="Action 4">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path d="M12 5v14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
              </button>

              <button class="ss-c-petal" type="button" aria-label="Action 5">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <rect x="6" y="6" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" />
                </svg>
              </button>
            </div>
          </div>

          <script>
            const wrap = document.querySelector('[data-fab]');
            const toggle = wrap.querySelector('[data-fab-toggle]');

            function setOpen(open) {
              wrap.classList.toggle('is-open', open);
              toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            }

            toggle.addEventListener('click', (e) => {
              e.stopPropagation();
              setOpen(!wrap.classList.contains('is-open'));
            });

            // dicht wanneer weg
            document.addEventListener('click', () => setOpen(false));

            // dicht wanneer escape
            document.addEventListener('keydown', (e) => {
              if (e.key === 'Escape') setOpen(false);
            });

            wrap.addEventListener('click', (e) => e.stopPropagation());
          </script>

        </section>
        <section class="ss-c-fab_corner">
        <div class="ss-c-robins_diag" data-robins-dial>
          <!-- Main FAB -->
          <button class="ss-c-robins_diag_fab" type="button" aria-label="robins open menu" data-diag-toggle>
            M
          </button>

          <!-- Actions -->
          <div class="ss-c-robins_diag-actions" aria-label="Actions">
            <button class="ss-c-robins_diag-action" type="button" aria-label="robins_action A">A</button>
            <button class="ss-c-robins_diag-action" type="button" aria-label="robins_action B">B</button>
            <button class="ss-c-robins_diag-action" type="button" aria-label="robins_action C">C</button>
            <button class="ss-c-robins_diag-action" type="button" aria-label="robins_action D">D</button>
          </div>
        </div>

        </section>
    `,
};

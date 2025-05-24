type GridLayer = HTMLElement & { dataset: { grid: string } };
type ToggleButton = HTMLButtonElement & { dataset: { toggle: string } };

export class GridManager {
  private readonly STORAGE_KEY = 'unitgl:grid:visibility';
  private visibilityMap: Record<string, boolean> = {};

  constructor() {
    this.loadVisibility();
    this.applyVisibilityState();
    this.setupEventListeners();
  }

  private loadVisibility(): void {
    try {
      this.visibilityMap = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    } catch {
      this.visibilityMap = {};
    }
  }

  private saveVisibility(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.visibilityMap));
  }

  private updateAllGridHeights(): void {
    const height = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      document.documentElement.offsetHeight,
      document.body.offsetHeight
    );

    document.querySelectorAll<HTMLElement>('.guide--layer').forEach(layer => {
      if (layer.offsetHeight !== height) {
        layer.style.height = `${height}px`;
      }
    });
  }

  private applyVisibilityState(): void {
    document.querySelectorAll<GridLayer>('.guide--layer').forEach(layer => {
      const id = layer.dataset.grid;
      const isActive = !!this.visibilityMap[id];
      layer.classList.toggle('active', isActive);
    });

    document.querySelectorAll<ToggleButton>('button[data-toggle]').forEach(button => {
      const id = button.dataset.toggle;
      const isActive = !!this.visibilityMap[id];
      button.classList.toggle('active', isActive);
    });
  }

  private setupToggleButtons(): void {
    document.querySelectorAll<ToggleButton>('button[data-toggle]').forEach(button => {
      const id = button.dataset.toggle;
      const layer = document.querySelector<GridLayer>(`[data-grid="${id}"]`);
      if (!layer) return;

      button.addEventListener('click', () => {
        const isNowActive = layer.classList.toggle('active');
        button.classList.toggle('active', isNowActive);
        this.visibilityMap[id] = isNowActive;
        this.saveVisibility();
      });
    });
  }

  private setupEventListeners(): void {
    document.addEventListener('DOMContentLoaded', () => {
      this.updateAllGridHeights();
      this.setupToggleButtons();

      window.addEventListener('resize', () => this.updateAllGridHeights());
      window.addEventListener('scroll', () => this.updateAllGridHeights());
    });
  }
}

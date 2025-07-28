import { create } from "zustand"

interface Element {
  id: string
  type: string
  properties: Record<string, any>
}

interface BuilderState {
  elements: Element[]
  selectedElement: Element | null
  deviceMode: "desktop" | "tablet" | "mobile"
  history: Element[][]
  historyIndex: number
  canUndo: boolean
  canRedo: boolean
}

interface BuilderActions {
  addElement: (element: Element) => void
  updateElement: (id: string, properties: Record<string, any>) => void
  deleteElement: (id: string) => void
  setSelectedElement: (element: Element | null) => void
  setDeviceMode: (mode: "desktop" | "tablet" | "mobile") => void
  setElements: (elements: Element[]) => void
  undo: () => void
  redo: () => void
  saveToHistory: () => void
  duplicateElement: (id: string) => void
}

export const useBuilderStore = create<BuilderState & BuilderActions>((set, get) => ({
  elements: [],
  selectedElement: null,
  deviceMode: "desktop",
  history: [[]],
  historyIndex: 0,
  canUndo: false,
  canRedo: false,

  setElements: (elements) => {
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push(elements)

      return {
        elements,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        canUndo: newHistory.length > 1,
        canRedo: false,
      }
    })
  },

  addElement: (element) => {
    set((state) => {
      const newElements = [...state.elements, element]
      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push(newElements)

      return {
        elements: newElements,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        canUndo: true,
        canRedo: false,
      }
    })
  },

  updateElement: (id, properties) => {
    set((state) => {
      const newElements = state.elements.map((el) =>
        el.id === id ? { ...el, properties: { ...el.properties, ...properties } } : el,
      )

      // Check if this is a resize operation (width, height, x, y changes)
      const isResizeOperation = properties.width !== undefined || properties.height !== undefined || 
                               properties.x !== undefined || properties.y !== undefined

      // If it's a resize operation, save to history
      if (isResizeOperation) {
        const newHistory = state.history.slice(0, state.historyIndex + 1)
        newHistory.push(newElements)

        return {
          elements: newElements,
          selectedElement:
            state.selectedElement?.id === id
              ? { ...state.selectedElement, properties: { ...state.selectedElement.properties, ...properties } }
              : state.selectedElement,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          canUndo: true,
          canRedo: false,
        }
      }

      return {
        elements: newElements,
        selectedElement:
          state.selectedElement?.id === id
            ? { ...state.selectedElement, properties: { ...state.selectedElement.properties, ...properties } }
            : state.selectedElement,
      }
    })
  },

  deleteElement: (id) => {
    set((state) => {
      const newElements = state.elements.filter((el) => el.id !== id)
      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push(newElements)

      return {
        elements: newElements,
        selectedElement: state.selectedElement?.id === id ? null : state.selectedElement,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        canUndo: true,
        canRedo: false,
      }
    })
  },

  setSelectedElement: (element) => {
    set({ selectedElement: element })
  },

  setDeviceMode: (mode) => {
    set({ deviceMode: mode })
  },

  undo: () => {
    set((state) => {
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1
        return {
          elements: state.history[newIndex],
          historyIndex: newIndex,
          canUndo: newIndex > 0,
          canRedo: true,
          selectedElement: null,
        }
      }
      return state
    })
  },

  redo: () => {
    set((state) => {
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1
        return {
          elements: state.history[newIndex],
          historyIndex: newIndex,
          canUndo: true,
          canRedo: newIndex < state.history.length - 1,
          selectedElement: null,
        }
      }
      return state
    })
  },

  saveToHistory: () => {
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push([...state.elements])

      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
        canUndo: true,
        canRedo: false,
      }
    })
  },

  duplicateElement: (id) => {
    set((state) => {
      const elementToDuplicate = state.elements.find((el) => el.id === id)
      if (!elementToDuplicate) return {}
      const newElement = {
        ...elementToDuplicate,
        id: `${elementToDuplicate.id}-copy-${Date.now()}`,
        properties: {
          ...elementToDuplicate.properties,
          x: (elementToDuplicate.properties.x || 0) + 20,
          y: (elementToDuplicate.properties.y || 0) + 20,
        },
      }
      const newElements = [...state.elements, newElement]
      const newHistory = state.history.slice(0, state.historyIndex + 1)
      newHistory.push(newElements)
      return {
        elements: newElements,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        canUndo: true,
        canRedo: false,
      }
    })
  },
}))

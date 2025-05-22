"use client"

import * as React from "react"
import { useWhiteboard } from "@/hooks/use-whiteboard"
import { WhiteboardElement, Point } from "@/types"

interface WhiteboardObjectProps {
  element: WhiteboardElement
  isSelected: boolean
  onSelect: (event: React.MouseEvent) => void
}

export default function WhiteboardObject({ element, isSelected, onSelect }: WhiteboardObjectProps) {
  const { updateElement } = useWhiteboard()
  const [isEditing, setIsEditing] = React.useState(false)
  const [dragStart, setDragStart] = React.useState<Point | null>(null)
  const [elementPosition, setElementPosition] = React.useState({ x: element.x, y: element.y })
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  // For text elements, enable editing on double-click
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (element.type === "text") {
      e.stopPropagation()
      setIsEditing(true)
      // Focus the textarea after render
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
          textareaRef.current.select()
        }
      }, 10)
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateElement({
      ...element,
      content: e.target.value
    })
  }

  const handleBlur = () => {
    setIsEditing(false)
  }

  // Dragging functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return // Only left mouse button
    
    e.stopPropagation()
    onSelect(e)
    
    setDragStart({
      x: e.clientX,
      y: e.clientY
    })
    
    setElementPosition({
      x: element.x,
      y: element.y
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStart) return
    
    const dx = e.clientX - dragStart.x
    const dy = e.clientY - dragStart.y
    
    setElementPosition({
      x: elementPosition.x + dx,
      y: elementPosition.y + dy
    })
  }

  const handleMouseUp = () => {
    if (!dragStart) return
    
    updateElement({
      ...element,
      x: elementPosition.x,
      y: elementPosition.y
    })
    
    setDragStart(null)
  }

  // Render different elements based on type
  const renderElement = () => {
    switch (element.type) {
      case "pen":
        if (!element.points || element.points.length < 2) return null
        
        const pathData = element.points.reduce((path, point, i) => {
          if (i === 0) return `M ${point.x} ${point.y}`
          return `${path} L ${point.x} ${point.y}`
        }, "")
        
        return (
          <svg 
            className="absolute top-0 left-0 w-full h-full" 
            style={{ pointerEvents: "none" }}
          >
            <path
              d={pathData}
              fill="none"
              stroke={element.style.strokeColor}
              strokeWidth={element.style.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={element.style.opacity}
            />
          </svg>
        )
        
      case "line":
        if (!element.points || element.points.length !== 2) return null
        
        return (
          <svg 
            className="absolute top-0 left-0 w-full h-full"
            style={{ pointerEvents: "none" }}
          >
            <line
              x1={element.points[0].x}
              y1={element.points[0].y}
              x2={element.points[1].x}
              y2={element.points[1].y}
              stroke={element.style.strokeColor}
              strokeWidth={element.style.strokeWidth}
              opacity={element.style.opacity}
            />
          </svg>
        )
        
      case "rectangle":
        return (
          <svg 
            className="absolute top-0 left-0 w-full h-full"
            style={{ pointerEvents: "none" }}
          >
            <rect
              x={element.x}
              y={element.y}
              width={element.width}
              height={element.height}
              stroke={element.style.strokeColor}
              strokeWidth={element.style.strokeWidth}
              fill={element.style.fillColor}
              opacity={element.style.opacity}
            />
          </svg>
        )
        
      case "ellipse":
        return (
          <svg 
            className="absolute top-0 left-0 w-full h-full"
            style={{ pointerEvents: "none" }}
          >
            <ellipse
              cx={element.x + element.width / 2}
              cy={element.y + element.height / 2}
              rx={Math.abs(element.width / 2)}
              ry={Math.abs(element.height / 2)}
              stroke={element.style.strokeColor}
              strokeWidth={element.style.strokeWidth}
              fill={element.style.fillColor}
              opacity={element.style.opacity}
            />
          </svg>
        )
        
      case "text":
        return isEditing ? (
          <textarea
            ref={textareaRef}
            className="absolute p-0 m-0 overflow-hidden bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-primary"
            style={{
              left: `${element.x}px`,
              top: `${element.y}px`,
              width: `${element.width}px`,
              height: `${element.height}px`,
              color: element.style.fillColor,
              fontSize: `${element.style.fontSize || 16}px`,
              fontFamily: element.style.fontFamily || "Arial",
              opacity: element.style.opacity,
              border: "none"
            }}
            value={element.content || ""}
            onChange={handleTextChange}
            onBlur={handleBlur}
          />
        ) : (
          <div
            className="absolute whitespace-pre-wrap"
            style={{
              left: `${element.x}px`,
              top: `${element.y}px`,
              width: `${element.width}px`,
              minHeight: `${element.height}px`,
              color: element.style.fillColor,
              fontSize: `${element.style.fontSize || 16}px`,
              fontFamily: element.style.fontFamily || "Arial",
              opacity: element.style.opacity,
              pointerEvents: "none"
            }}
          >
            {element.content || ""}
          </div>
        )
        
      case "image":
        return (
          <img
            src={element.content}
            alt="Whiteboard image"
            className="absolute object-contain"
            style={{
              left: `${element.x}px`,
              top: `${element.y}px`,
              width: `${element.width}px`,
              height: `${element.height}px`,
              opacity: element.style.opacity,
              pointerEvents: "none"
            }}
          />
        )
        
      default:
        return null
    }
  }

  return (
    <div
      className="absolute"
      style={{
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        cursor: isSelected ? "move" : "pointer",
        outline: isSelected ? "2px solid #2563eb" : "none"
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      {renderElement()}
      
      {/* Selection handles - only visible when selected */}
      {isSelected && (
        <div className="absolute" style={{
          left: `${element.x - 5}px`,
          top: `${element.y - 5}px`,
          width: `${element.width + 10}px`,
          height: `${element.height + 10}px`,
          border: "1px solid #2563eb",
          pointerEvents: "none"
        }}>
          {/* Resize handles would go here */}
        </div>
      )}
    </div>
  )
}
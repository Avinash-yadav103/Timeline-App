"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

interface TimePickerProps {
  value: Date
  onChange: (date: Date) => void
}

export function TimePickerDemo({ value, onChange }: TimePickerProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null)
  const hourRef = React.useRef<HTMLInputElement>(null)
  const secondRef = React.useRef<HTMLInputElement>(null)

  const [hour, setHour] = React.useState<number>(value ? value.getHours() : 0)
  const [minute, setMinute] = React.useState<number>(value ? value.getMinutes() : 0)
  const [second, setSecond] = React.useState<number>(value ? value.getSeconds() : 0)

  React.useEffect(() => {
    if (value) {
      setHour(value.getHours())
      setMinute(value.getMinutes())
      setSecond(value.getSeconds())
    }
  }, [value])

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHour = Number.parseInt(e.target.value, 10)
    if (isNaN(newHour)) return

    if (newHour >= 0 && newHour <= 23) {
      setHour(newHour)
      updateTime(newHour, minute, second)
    }
  }

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinute = Number.parseInt(e.target.value, 10)
    if (isNaN(newMinute)) return

    if (newMinute >= 0 && newMinute <= 59) {
      setMinute(newMinute)
      updateTime(hour, newMinute, second)
    }
  }

  const handleSecondChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSecond = Number.parseInt(e.target.value, 10)
    if (isNaN(newSecond)) return

    if (newSecond >= 0 && newSecond <= 59) {
      setSecond(newSecond)
      updateTime(hour, minute, newSecond)
    }
  }

  const updateTime = (h: number, m: number, s: number) => {
    const newDate = new Date(value)
    newDate.setHours(h)
    newDate.setMinutes(m)
    newDate.setSeconds(s)
    onChange(newDate)
  }

  return (
    <Button
      variant="outline"
      className="w-full justify-start text-left font-normal"
      onClick={() => hourRef.current?.focus()}
    >
      <Clock className="mr-2 h-4 w-4" />
      {format(value, "h:mm a")}
    </Button>
  )
}


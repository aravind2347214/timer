import { render, screen } from '@testing-library/react'
import { it, expect, describe } from 'vitest'
import { TimerItem } from './TimerItem'
import { Timer } from '../../types/timer'
import { renderWithRedux } from '../../../tests/RenderWithRedux'

const timer : Timer={
    id: "111",
    title: "timer 1",
    description: "this is the mock timer",
    duration: 10,// in seconds
    remainingTime: 20,
    isRunning: false,
    createdAt: Date.now()
}

describe('Timer Item', () => {
    renderWithRedux(<TimerItem timer={timer}/>)
    it('should have Edit Restart and Delete Button', () => {
        expect(screen.getByTitle("Edit Button")).toBeInTheDocument()
        expect(screen.getByTitle("Restart Button")).toBeInTheDocument()
        expect(screen.getByTitle("Delete Button")).toBeInTheDocument()
    })
})
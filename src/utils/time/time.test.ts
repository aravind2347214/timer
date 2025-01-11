import { it, expect, describe } from 'vitest'
import { formatTime } from './time'

describe('formatTime',()=>{
    it('should give 0hours 0mins 0sec on giving 0 seconds',()=>{
        const time = formatTime(0)
        expect(time).toBe('00:00')
    })

    it('should give 1hours 1mins 1sec on giving 3661 seconds',()=>{
        const time = formatTime(3661)
        expect(time).toBe('01:01:01')
    })

    it('should give 0hours 1mins 1sec on giving 61 seconds',()=>{
        const time = formatTime(61)
        expect(time).toBe('01:01')
    })

    it('should give 0hours 0mins 5sec on giving 5 seconds',()=>{
        const time = formatTime(5)
        expect(time).toBe('00:05')
    })
})

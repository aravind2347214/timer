// import { render, screen } from '@testing-library/react'
import { render } from '@testing-library/react';
import { it, expect, describe } from 'vitest'
import { TimerBackground } from './TimerBackground';

describe('Timer Background', () => {
    it('should render a SVG element', () => {
        const { container } = render(<TimerBackground />);
        const svg = container.querySelector("svg");
        expect(svg).not.toBeNull();
        expect(svg).toBeInTheDocument()
    })
})
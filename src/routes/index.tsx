import { createFileRoute } from '@tanstack/react-router'
import { LandingPage } from '../components/shared/LandingPage'

export const Route = createFileRoute('/')({ component: LandingPage })

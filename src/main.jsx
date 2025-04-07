import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './globalStyles.css'
import RoutesConfig from './routes.jsx'

import { Analytics } from "@vercel/analytics/react"

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<RoutesConfig />
		<Analytics />
	</StrictMode>,
)
import { Routes, Route } from 'react-router'
import Layout from '@/components/Layout'
import NotFound from './pages/NotFound'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Docs from './pages/Docs'
import TaskBoard from './pages/TaskBoard'
import CRM from './pages/CRM'
import Pipeline from './pages/Pipeline'
import Funnels from './pages/Funnels'
import Courses from './pages/Courses'
import Communities from './pages/Communities'
import Campaigns from './pages/Campaigns'
import Agenda from './pages/Agenda'
import Automations from './pages/Automations'
import Research from './pages/Research'
import AIStudio from './pages/AIStudio'
import Sites from './pages/Sites'
import Templates from './pages/Templates'
import Config from './pages/Config'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Layout><Dashboard /></Layout>} />
      <Route path="/" element={<Layout><Dashboard /></Layout>} />
      <Route path="/projetos" element={<Layout><Projects /></Layout>} />
      <Route path="/docs" element={<Layout><Docs /></Layout>} />
      <Route path="/tarefas" element={<Layout><TaskBoard /></Layout>} />
      <Route path="/crm" element={<Layout><CRM /></Layout>} />
      <Route path="/pipeline" element={<Layout><Pipeline /></Layout>} />
      <Route path="/funis" element={<Layout><Funnels /></Layout>} />
      <Route path="/cursos" element={<Layout><Courses /></Layout>} />
      <Route path="/comunidades" element={<Layout><Communities /></Layout>} />
      <Route path="/campanhas" element={<Layout><Campaigns /></Layout>} />
      <Route path="/agenda" element={<Layout><Agenda /></Layout>} />
      <Route path="/automacoes" element={<Layout><Automations /></Layout>} />
      <Route path="/pesquisa" element={<Layout><Research /></Layout>} />
      <Route path="/ia" element={<Layout><AIStudio /></Layout>} />
      <Route path="/sites" element={<Layout><Sites /></Layout>} />
      <Route path="/templates" element={<Layout><Templates /></Layout>} />
      <Route path="/config" element={<Layout><Config /></Layout>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

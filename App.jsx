import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  CircleAlert,
  LayoutDashboard,
  LoaderCircle,
  MapPin,
  Menu,
  Plus,
  Search,
  Users,
  X,
} from 'lucide-react';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

const navItems = [
  { label: 'Home', path: '/', icon: LayoutDashboard },
  { label: 'Employee form', path: '/employee', icon: Plus },
];

function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Topbar />
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employee" element={<EmployeeForm />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-block">
          <Link className="brand" to="/" aria-label="Staffly home">
            <span className="brand-mark">S</span>
            <span>staffly</span>
          </Link>
          <button className="icon-button sidebar-close" type="button" onClick={() => setIsOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <div className="workspace-switcher">
          <span className="workspace-avatar">AC</span>
          <span className="workspace-copy">
            <strong>Acme Corp.</strong>
            <small>Workspace</small>
          </span>
          <ChevronDown size={16} className="muted-icon" />
        </div>

        <p className="nav-heading">Workspace</p>
        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}
              end={path === '/'}
            >
              <Icon size={19} strokeWidth={1.9} />
              <span>{label}</span>
              {path === '/' && <span className="nav-count">10</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="support-card">
            <div className="support-icon"><BriefcaseBusiness size={18} /></div>
            <div>
              <strong>Need a hand?</strong>
              <span>We’re here to help.</span>
            </div>
            <ArrowRight size={16} />
          </div>
          <div className="profile-row">
            <div className="profile-avatar">JD</div>
            <div className="profile-copy">
              <strong>Jordan Davis</strong>
              <span>Administrator</span>
            </div>
            <button className="icon-button" type="button" aria-label="Open profile menu"><MoreDots /></button>
          </div>
        </div>
      </aside>
      {isOpen && <button className="sidebar-overlay" type="button" onClick={() => setIsOpen(false)} aria-label="Close navigation" />}
      <button className="mobile-menu-button" type="button" onClick={() => setIsOpen(true)} aria-label="Open navigation">
        <Menu size={22} />
      </button>
    </>
  );
}

function MoreDots() {
  return <span className="more-dots"><i /><i /><i /></span>;
}

function Topbar() {
  const location = useLocation();
  const isForm = location.pathname === '/employee';

  return (
    <header className="topbar">
      <div className="breadcrumb">
        <span>Workspace</span>
        <span className="breadcrumb-slash">/</span>
        <strong>{isForm ? 'Add employee' : 'Dashboard'}</strong>
      </div>
      <div className="topbar-actions">
        <span className="status-pill"><span className="status-dot" /> All systems operational</span>
        <div className="topbar-avatar">JD</div>
      </div>
    </header>
  );
}

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadEmployees = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Unable to load employees');
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Unexpected employee data');
      setEmployees(data);
    } catch {
      setErrorMessage('We couldn’t load the employee list right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return employees;
    return employees.filter((employee) =>
      [employee.name, employee.email, employee.company?.name].some((value) =>
        value?.toLowerCase().includes(normalizedSearch),
      ),
    );
  }, [employees, searchTerm]);

  return (
    <div className="dashboard-page">
      <section className="page-heading dashboard-heading">
        <div>
          <p className="eyebrow">Wednesday, November 25, 2026</p>
          <h1>Good morning, Jordan <span className="heading-accent">.</span></h1>
          <p className="heading-description">Here’s what’s happening with your team today.</p>
        </div>
        <Link className="primary-button" to="/employee">
          <Plus size={18} strokeWidth={2.2} /> Add employee
        </Link>
      </section>

      <section className="stats-grid" aria-label="Employee overview">
        <StatCard label="Total employees" value={isLoading ? '—' : employees.length} detail="Across your workspace" icon={<Users size={20} />} tone="blue" />
        <StatCard label="Active this month" value="09" detail="90% of your team" icon={<Check size={20} />} tone="green" />
        <StatCard label="Open positions" value="03" detail="2 new this week" icon={<BriefcaseBusiness size={20} />} tone="orange" />
      </section>

      <section className="employee-panel">
        <div className="panel-header">
          <div>
            <h2>All employees</h2>
            <p>Manage and view everyone in your workspace.</p>
          </div>
          <div className="panel-tools">
            <label className="search-box">
              <Search size={17} />
              <span className="sr-only">Search employees</span>
              <input
                type="search"
                placeholder="Search employees"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>
            <button className="filter-button" type="button">All employees <ChevronDown size={16} /></button>
          </div>
        </div>

        {isLoading && <LoadingState />}
        {!isLoading && errorMessage && <ErrorState message={errorMessage} onRetry={loadEmployees} />}
        {!isLoading && !errorMessage && filteredEmployees.length === 0 && <EmptyState searchTerm={searchTerm} />}
        {!isLoading && !errorMessage && filteredEmployees.length > 0 && <EmployeeTable employees={filteredEmployees} />}
      </section>
    </div>
  );
}

function StatCard({ label, value, detail, icon, tone }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon stat-icon-${tone}`}>{icon}</div>
      <div className="stat-content">
        <span className="stat-label">{label}</span>
        <strong>{value}</strong>
        <span className="stat-detail">{detail}</span>
      </div>
      <span className="stat-sparkline"><i /><i /><i /><i /><i /><i /><i /></span>
    </article>
  );
}

function EmployeeTable({ employees }) {
  return (
    <div className="table-wrap">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Company</th>
            <th>Location</th>
            <th>Status</th>
            <th><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => {
            const initials = employee.name.split(' ').map((part) => part[0]).join('').slice(0, 2);
            return (
              <tr key={employee.id}>
                <td>
                  <div className="employee-cell">
                    <span className={`employee-avatar avatar-${(index % 5) + 1}`}>{initials}</span>
                    <span className="employee-name"><strong>{employee.name}</strong><small>{employee.email}</small></span>
                  </div>
                </td>
                <td><span className="company-name">{employee.company?.name ?? 'Independent'}</span></td>
                <td><span className="location-cell"><MapPin size={15} />{employee.address?.city ?? 'Remote'}</span></td>
                <td><span className="active-badge"><span /> Active</span></td>
                <td><button className="row-menu" type="button" aria-label={`Options for ${employee.name}`}><MoreDots /></button></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="table-footer">
        <span>Showing <strong>{employees.length}</strong> employees</span>
        <span className="data-source">Live data <span className="source-dot" /></span>
      </div>
    </div>
  );
}

function LoadingState() {
  return <div className="loading-state"><LoaderCircle className="spin" size={24} /><span>Loading employee directory...</span></div>;
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="message-state error-state">
      <CircleAlert size={24} />
      <p>{message}</p>
      <button className="secondary-button" type="button" onClick={onRetry}>Try again</button>
    </div>
  );
}

function EmptyState({ searchTerm }) {
  return <div className="message-state"><Search size={24} /><p>No employees found{searchTerm ? ` for “${searchTerm}”` : ''}.</p></div>;
}

function EmployeeForm() {
  const [formData, setFormData] = useState({ name: '', designation: '', location: '', salary: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = (field) => (event) => {
    setFormData((current) => ({ ...current, [field]: event.target.value }));
    setIsSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="form-page">
      <section className="page-heading form-heading">
        <div>
          <p className="eyebrow">Workspace directory</p>
          <h1>Add an employee <span className="heading-accent">.</span></h1>
          <p className="heading-description">Create a profile for a new member of your team.</p>
        </div>
        <Link className="text-link" to="/"><ArrowRight size={17} className="back-arrow" /> Back to directory</Link>
      </section>

      <div className="form-layout">
        <form className="employee-form" onSubmit={handleSubmit}>
          <div className="form-card-header">
            <div className="form-card-icon"><Users size={21} /></div>
            <div><h2>Employee details</h2><p>Fill in the information below to get started.</p></div>
          </div>
          <div className="form-fields">
            <label className="field full-field"><span>Full name <em>*</em></span><input type="text" placeholder="e.g. Alex Morgan" value={formData.name} onChange={updateField('name')} required /></label>
            <label className="field"><span>Designation <em>*</em></span><input type="text" placeholder="e.g. Product designer" value={formData.designation} onChange={updateField('designation')} required /></label>
            <label className="field"><span>Location <em>*</em></span><input type="text" placeholder="e.g. New York, NY" value={formData.location} onChange={updateField('location')} required /></label>
            <label className="field"><span>Annual salary <em>*</em></span><div className="input-with-prefix"><span>$</span><input type="number" min="0" placeholder="e.g. 75,000" value={formData.salary} onChange={updateField('salary')} required /></div></label>
          </div>
          <div className="form-actions"><Link className="secondary-button" to="/">Cancel</Link><button className="primary-button" type="submit">Save employee <ArrowRight size={17} /></button></div>
          {isSubmitted && <div className="success-message"><Check size={17} /> Employee details saved for this session.</div>}
        </form>

        <aside className="form-tip">
          <span className="tip-kicker">Quick note</span>
          <h2>Build a team people love to be part of.</h2>
          <p>Keep employee details up to date so your workspace always reflects the people behind the work.</p>
          <div className="tip-line" />
          <span className="tip-caption">Private workspace · Admin only</span>
        </aside>
      </div>
    </div>
  );
}

export default App;

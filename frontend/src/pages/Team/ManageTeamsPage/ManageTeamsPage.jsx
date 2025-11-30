import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "#utils/api.js";
import CreateTeamModal from "#components/TeamComponent/CreateTeamModal/CreateTeamModal.jsx";
import "./ManageTeamsPage.css";

const roleLabels = {
	leader: "Leader",
	edit: "Editor",
	view: "Viewer",
};

const roleThemes = {
	leader: "role-chip leader",
	edit: "role-chip editor",
	view: "role-chip viewer",
};

export default function ManageTeamsPage() {
	const navigate = useNavigate();
	const [teams, setTeams] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [roleFilter, setRoleFilter] = useState("all");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [showCreateModal, setShowCreateModal] = useState(false);

	const fetchTeams = async () => {
		try {
			setLoading(true);
			const response = await api.get("/teams/my-teams");
			setTeams(response.data?.teams ?? []);
			setError("");
		} catch (err) {
			const message = err.response?.data?.message || "Không thể tải danh sách nhóm.";
			setError(message);
			setTeams([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchTeams();
	}, []);

	const stats = useMemo(() => {
		const base = { total: teams.length, leader: 0, edit: 0, view: 0 };
		teams.forEach((team) => {
			if (team.role && base[team.role] !== undefined) {
				base[team.role] += 1;
			}
		});
		return base;
	}, [teams]);

	const filteredTeams = useMemo(() => {
		return teams.filter((team) => {
			const matchesSearch = team.name?.toLowerCase().includes(searchTerm.trim().toLowerCase());
			const matchesRole = roleFilter === "all" || team.role === roleFilter;
			return matchesSearch && matchesRole;
		});
	}, [teams, searchTerm, roleFilter]);

	return (
		<div className="manage-teams-layout">
			<aside className="manage-teams-sidebar">
				<div className="sidebar-heading">
					<p className="eyebrow">Team hub</p>
					<h2>Quick actions</h2>
				</div>

				<button className="primary-cta" onClick={() => setShowCreateModal(true)}>
					+ Create team
				</button>

				<div className="sidebar-card">
					<p className="sidebar-label">Your roles</p>
					<div className="role-summary">
						<div>
							<p className="summary-value">{stats.total}</p>
							<p className="summary-label">Total</p>
						</div>
						<div>
							<p className="summary-value">{stats.leader}</p>
							<p className="summary-label">Leader</p>
						</div>
						<div>
							<p className="summary-value">{stats.edit}</p>
							<p className="summary-label">Editor</p>
						</div>
						<div>
							<p className="summary-value">{stats.view}</p>
							<p className="summary-label">Viewer</p>
						</div>
					</div>
				</div>

				<div className="sidebar-card">
					<p className="sidebar-label">Filter by role</p>
					<div className="filter-chip-group">
						{[
							{ id: "all", label: "All" },
							{ id: "leader", label: "Leader" },
							{ id: "edit", label: "Editor" },
							{ id: "view", label: "Viewer" },
						].map((option) => (
							<button
								key={option.id}
								className={
									roleFilter === option.id ? "chip chip-active" : "chip"
								}
								onClick={() => setRoleFilter(option.id)}
							>
								{option.label}
							</button>
						))}
					</div>
				</div>

				<button className="ghost-cta" onClick={fetchTeams}>
					Refresh list
				</button>
			</aside>

			<main className="manage-teams-main">
				<header className="teams-header">
					<div>
						<h1>Manage your teams</h1>
						<p>Select a team to view details, invite members, or update settings.</p>
					</div>
					<div className="search-box-manage-teams">
						<input
							type="text"
							placeholder="Search by team name"
							value={searchTerm}
							onChange={(event) => setSearchTerm(event.target.value)}
						/>
					</div>
				</header>

				{error && <div className="alert error-alert">{error}</div>}

				{loading ? (
					<div className="placeholder-card">Loading teams...</div>
				) : filteredTeams.length === 0 ? (
					<div className="placeholder-card">
						<h3>No teams found</h3>
						<p>Try another search term or create a new team to get started.</p>
					</div>
				) : (
					<div className="teams-grid">
						{filteredTeams.map((team) => (
							<div className="team-card" key={team.id}>
								<div className="team-card-header">
									<h3>{team.name}</h3>
									<span className={roleThemes[team.role] || "role-chip"}>
										{roleLabels[team.role] || "Member"}
									</span>
								</div>
								<p className="team-id">Team ID: {team.id}</p>
								<p className="team-meta">
									This workspace inherits permissions based on your role.
								</p>
								<div className="team-card-actions">
									<button className="ghost-cta" onClick={() => navigate(`/team/${team.id}`)}>
										View team
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</main>

			{showCreateModal && (
				<CreateTeamModal
					onClose={() => setShowCreateModal(false)}
					onCreated={fetchTeams}
				/>
			)}
		</div>
	);
}

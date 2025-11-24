import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "#utils/api.js";
import "./TeamPage.css";

const NAV_ITEMS = [
	{ id: "overview", label: "Overview", icon: "📋" },
	{ id: "members", label: "Members", icon: "👥" },
];

const roleLabels = {
	leader: "Leader",
	edit: "Editor",
	view: "Viewer",
};

const DEFAULT_AVATAR = "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/03/avatar-trang-66.jpg";

export default function TeamPage() {
	const { teamId } = useParams();
	const navigate = useNavigate();
	const [teams, setTeams] = useState([]);
	const [selectedTeamId, setSelectedTeamId] = useState(teamId || "");
	const [members, setMembers] = useState([]);
	const [activeNav, setActiveNav] = useState("overview");
	const [roleFilter, setRoleFilter] = useState("all");
	const [loadingTeams, setLoadingTeams] = useState(true);
	const [loadingMembers, setLoadingMembers] = useState(true);
	const [error, setError] = useState("");
	const [actionMessage, setActionMessage] = useState("");
	const [actionType, setActionType] = useState("success");
	const [showAddMemberModal, setShowAddMemberModal] = useState(false);
	const [friends, setFriends] = useState([]);
	const [friendsLoading, setFriendsLoading] = useState(false);
	const [friendsError, setFriendsError] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [searchLoading, setSearchLoading] = useState(false);
	const [searchError, setSearchError] = useState("");
	const [selectedFriendId, setSelectedFriendId] = useState("");
	const [memberRole, setMemberRole] = useState("view");
	const [addingMember, setAddingMember] = useState(false);
	const [actionLoadingId, setActionLoadingId] = useState(null);

	useEffect(() => {
		const loadTeams = async () => {
			try {
				setLoadingTeams(true);
				const response = await api.get("/teams/my-teams");
				const userTeams = response.data?.teams ?? [];
				setTeams(userTeams);
				if (!selectedTeamId && userTeams.length > 0) {
					setSelectedTeamId(userTeams[0].id);
				}
			} catch (err) {
				const message = err.response?.data?.message || "Không thể tải danh sách nhóm.";
				setError(message);
			} finally {
				setLoadingTeams(false);
			}
		};

		loadTeams();
	}, []);

	const loadMembers = useCallback(
		async (teamIdentifier) => {
			if (!teamIdentifier) {
				return;
			}
			try {
				setLoadingMembers(true);
				const response = await api.get(`/teams/${teamIdentifier}/members`);
				setMembers(response.data?.members ?? []);
				setError("");
			} catch (err) {
				const message = err.response?.data?.message || "Không thể tải thành viên.";
				setError(message);
				setMembers([]);
			} finally {
				setLoadingMembers(false);
			}
		},
		[]
	);

	useEffect(() => {
		if (!selectedTeamId) {
			return;
		}

		loadMembers(selectedTeamId);
	}, [selectedTeamId, loadMembers]);

	useEffect(() => {
		setActionMessage("");
		setActionType("success");
	}, [selectedTeamId]);

	useEffect(() => {
		if (teamId && teamId !== selectedTeamId) {
			setSelectedTeamId(teamId);
		}
	}, [teamId]);

	useEffect(() => {
		if (selectedTeamId && selectedTeamId !== teamId) {
			navigate(`/team/${selectedTeamId}`, { replace: true });
		}
	}, [selectedTeamId, teamId, navigate]);

	const currentTeam = teams.find((team) => team.id === selectedTeamId);

	const memberStats = useMemo(() => {
		const stats = { total: members.length, leader: 0, edit: 0, view: 0 };
		members.forEach((member) => {
			if (member.role && stats[member.role] !== undefined) {
				stats[member.role] += 1;
			}
		});
		return stats;
	}, [members]);

	const filteredMembers = useMemo(() => {
		if (roleFilter === "all") {
			return members;
		}
		return members.filter((member) => member.role === roleFilter);
	}, [members, roleFilter]);

	const getAvatarUrl = useCallback((url) => {
		return url && url.trim() !== "" ? url : DEFAULT_AVATAR;
	}, []);

	const handleAvatarError = useCallback((event) => {
		event.currentTarget.onerror = null;
		event.currentTarget.src = DEFAULT_AVATAR;
	}, []);

	const selectedAccount = useMemo(() => {
		if (!selectedFriendId) {
			return null;
		}
		return [...searchResults, ...friends].find((account) => account.id === selectedFriendId) || null;
	}, [selectedFriendId, searchResults, friends]);

		const isLeader = currentTeam?.role === "leader";

	const fetchFriendsNotInTeam = useCallback(async () => {
		if (!selectedTeamId) {
			return;
		}
		try {
			setFriendsLoading(true);
			const response = await api.get(`/teams/${selectedTeamId}/friends-not-in-team`);
			setFriends(response.data?.friends ?? []);
			setFriendsError("");
		} catch (err) {
			const message = err.response?.data?.message || "Không thể tải danh sách bạn bè.";
			setFriends([]);
			setFriendsError(message);
		} finally {
			setFriendsLoading(false);
		}
	}, [selectedTeamId]);

	useEffect(() => {
		if (!showAddMemberModal || !selectedTeamId) {
			return;
		}

		const trimmed = searchQuery.trim();
		if (!trimmed) {
			setSearchResults([]);
			setSearchError("");
			setSearchLoading(false);
			return;
		}

		if (trimmed.length < 2) {
			setSearchResults([]);
			setSearchError("Nhập ít nhất 2 ký tự để tìm kiếm");
			setSearchLoading(false);
			return;
		}

		let isActive = true;
		setSearchLoading(true);
		setSearchError("");
		const handler = setTimeout(async () => {
			try {
				const response = await api.get(`/teams/${selectedTeamId}/search-accounts`, {
					params: { query: trimmed },
				});
				if (!isActive) {
					return;
				}
				setSearchResults(response.data?.accounts ?? []);
			} catch (err) {
				if (!isActive) {
					return;
				}
				const message = err.response?.data?.message || "Không thể tìm kiếm tài khoản.";
				setSearchResults([]);
				setSearchError(message);
			} finally {
				if (isActive) {
					setSearchLoading(false);
				}
			}
		}, 400);

		return () => {
			isActive = false;
			clearTimeout(handler);
		};
	}, [searchQuery, showAddMemberModal, selectedTeamId]);

	const openAddMemberModal = () => {
		setSelectedFriendId("");
		setMemberRole("view");
		setFriendsError("");
		setSearchQuery("");
		setSearchResults([]);
		setSearchError("");
		setShowAddMemberModal(true);
		fetchFriendsNotInTeam();
	};

	const closeAddMemberModal = () => {
		setShowAddMemberModal(false);
		setFriendsError("");
		setSelectedFriendId("");
		setSearchQuery("");
		setSearchResults([]);
		setSearchError("");
	};

	const handleAddMember = async () => {
		if (!selectedFriendId) {
			setFriendsError("Vui lòng chọn một thành viên.");
			return;
		}
		try {
			setAddingMember(true);
			await api.post(`/teams/${selectedTeamId}/members`, {
				accountId: selectedFriendId,
				role: memberRole,
			});
			setActionType("success");
			setActionMessage("Đã thêm thành viên vào nhóm.");
			await loadMembers(selectedTeamId);
			closeAddMemberModal();
		} catch (err) {
			const message = err.response?.data?.message || "Không thể thêm thành viên.";
			setFriendsError(message);
			setActionType("error");
			setActionMessage(message);
		} finally {
			setAddingMember(false);
		}
	};

	const handleChangeRole = async (memberId, nextRole) => {
		if (!selectedTeamId) {
			return;
		}
		try {
			setActionLoadingId(memberId);
			await api.put(`/teams/${selectedTeamId}/members/${memberId}/role`, {
				role: nextRole,
			});
			setActionType("success");
			setActionMessage("Đã cập nhật quyền hạn thành viên.");
			await loadMembers(selectedTeamId);
		} catch (err) {
			const message = err.response?.data?.message || "Không thể cập nhật quyền.";
			setActionType("error");
			setActionMessage(message);
		} finally {
			setActionLoadingId(null);
		}
	};

	const handleRemoveMember = async (memberId) => {
		if (!selectedTeamId) {
			return;
		}
		try {
			setActionLoadingId(memberId);
			await api.delete(`/teams/${selectedTeamId}/members/${memberId}`);
			setActionType("success");
			setActionMessage("Đã xóa thành viên khỏi nhóm.");
			await loadMembers(selectedTeamId);
		} catch (err) {
			const message = err.response?.data?.message || "Không thể xóa thành viên.";
			setActionType("error");
			setActionMessage(message);
		} finally {
			setActionLoadingId(null);
		}
	};

	return (
		<div className="team-page-layout">
			<aside className="team-page-sidebar">
				<div className="team-selector-block">
					<label htmlFor="team-select">Choose team</label>
					<select
						id="team-select"
						value={selectedTeamId}
						onChange={(event) => setSelectedTeamId(event.target.value)}
						disabled={loadingTeams || teams.length === 0}
					>
						{teams.map((team) => (
							<option value={team.id} key={team.id}>
								{team.name}
							</option>
						))}
					</select>
					<button className="sidebar-link" onClick={() => navigate("/teams")}>Back to manage</button>
				</div>

				<nav className="team-nav">
					{NAV_ITEMS.map((item) => (
						<button
							key={item.id}
							className={activeNav === item.id ? "team-nav-item active" : "team-nav-item"}
							onClick={() => setActiveNav(item.id)}
						>
							<span className="nav-icon" aria-hidden="true">
								{item.icon}
							</span>
							<span>{item.label}</span>
						</button>
					))}
				</nav>
			</aside>

			<main className="team-page-main">
				{actionMessage && (
					<div className={`alert ${actionType === "success" ? "success-alert" : "error-alert"}`}>
						{actionMessage}
					</div>
				)}
				{error && <div className="alert error-alert">{error}</div>}

				{activeNav === "overview" && (
					<section className="team-overview">
						<header>
							<p className="eyebrow">Team overview</p>
							<h1>{currentTeam?.name || "Your team"}</h1>
							<p className="subtitle">
								{currentTeam
									? `You are assigned as ${roleLabels[currentTeam.role] || "member"}.`
									: "Select a team to get started."}
							</p>
						</header>

						<div className="stats-grid">
							<article>
								<p className="label">Total members</p>
								<p className="value">{memberStats.total}</p>
							</article>
							<article>
								<p className="label">Leaders</p>
								<p className="value">{memberStats.leader}</p>
							</article>
							<article>
								<p className="label">Editors</p>
								<p className="value">{memberStats.edit}</p>
							</article>
							<article>
								<p className="label">Viewers</p>
								<p className="value">{memberStats.view}</p>
							</article>
						</div>

						<div className="quick-actions">
							<button className="primary-cta" onClick={() => setActiveNav("members")}>View members</button>
							<button className="ghost-cta" onClick={() => navigate("/teams")}>Open manage view</button>
						</div>
					</section>
				)}

				{activeNav === "members" && (
					<section className="team-members">
						<header>
							<div>
								<h2>Members</h2>
								<p>Manage membership and see each role at a glance.</p>
							</div>
							<div className="members-header-actions">
								<div className="filter-chip-group">
									{["all", "leader", "edit", "view"].map((role) => (
										<button
											key={role}
											className={roleFilter === role ? "chip chip-active" : "chip"}
											onClick={() => setRoleFilter(role)}
										>
											{role === "all" ? "All" : roleLabels[role]}
										</button>
									))}
								</div>
								{currentTeam?.role === "leader" && (
									<button className="add-member-btn" onClick={openAddMemberModal}>
										+ Add member
									</button>
								)}
							</div>
						</header>

						{loadingMembers ? (
							<div className="placeholder-card">Loading members...</div>
						) : filteredMembers.length === 0 ? (
							<div className="placeholder-card">
								<h3>No members</h3>
								<p>Invite teammates to collaborate on this workspace.</p>
							</div>
						) : (
							<div className="members-grid">
								{filteredMembers.map((member) => (
									<article className="member-card" key={member.id}>
										<div className="member-meta">
											<div className="avatar" aria-hidden="true">
												<img src={getAvatarUrl(member.avatar)} alt="" onError={handleAvatarError} />
											</div>
											<div>
												<p className="member-name">{member.fullname || member.username || "Unknown"}</p>
												<p className="member-email">{member.email}</p>
											</div>
										</div>
										<div className="member-actions">
											<span className={`role-chip ${member.role}`}>{roleLabels[member.role] || member.role}</span>
											{isLeader && member.role !== "leader" && (
												<div className="member-controls">
													<select
														value={member.role}
														onChange={(event) => handleChangeRole(member.accountId, event.target.value)}
														disabled={actionLoadingId === member.accountId}
													>
														<option value="edit">Editor</option>
														<option value="view">Viewer</option>
													</select>
													<button
														type="button"
														className="danger-link"
														onClick={() => handleRemoveMember(member.accountId)}
														disabled={actionLoadingId === member.accountId}
													>
														Remove
													</button>
												</div>
											)}
										</div>
									</article>
								))}
							</div>
						)}
					</section>
				)}
			</main>

			{showAddMemberModal && (
				<div className="modal-backdrop" role="dialog" aria-modal="true">
					<div className="modal-card">
						<header className="modal-header">
							<div>
								<h3>Add member</h3>
								<p>Tìm kiếm toàn bộ tài khoản hoặc chọn nhanh từ bạn bè của bạn.</p>
							</div>
							<button className="modal-close" onClick={closeAddMemberModal} aria-label="Đóng">
								×
							</button>
						</header>
						<div className="modal-body">
							<section className="modal-section">
								<label className="modal-label" htmlFor="account-search-input">
									Search all accounts
								</label>
								<input
									id="account-search-input"
									type="text"
									placeholder="Nhập tên, email hoặc username"
									value={searchQuery}
									onChange={(event) => setSearchQuery(event.target.value)}
								/>
								{searchError && searchQuery.trim().length > 0 && (
									<p className="inline-hint error-hint">{searchError}</p>
								)}
								<div className="candidate-list">
									{searchLoading ? (
										<div className="placeholder-card">Đang tìm kiếm tài khoản...</div>
									) : searchQuery.trim().length < 2 ? (
										<div className="placeholder-card">
											<h3>Bắt đầu tìm kiếm</h3>
											<p>Nhập tối thiểu 2 ký tự để quét toàn bộ hệ thống.</p>
										</div>
									) : searchResults.length === 0 ? (
										<div className="placeholder-card">
											<h3>Không tìm thấy tài khoản</h3>
											<p>Thử từ khóa khác hoặc kiểm tra lại chính tả.</p>
										</div>
									) : (
										<ul>
											{searchResults.map((account) => (
													<li key={account.id}>
														<button
															type="button"
															className={selectedFriendId === account.id ? "candidate-item selected" : "candidate-item"}
															onClick={() => setSelectedFriendId(account.id)}
														>
															<div className="avatar">
																<img src={getAvatarUrl(account.avatar)} alt="" onError={handleAvatarError} />
															</div>
															<div>
																<p className="member-name">{account.fullname || account.username || "Unknown"}</p>
																<p className="member-email">{account.email}</p>
															</div>
														</button>
													</li>
											))}
									</ul>
								)}
								</div>
							</section>
							<section className="modal-section">
								<div className="section-heading">
									<h4>Bạn bè có thể thêm</h4>
									<p>Danh sách bạn bè chưa ở trong nhóm này.</p>
								</div>
								{friendsError && <div className="alert error-alert small-alert">{friendsError}</div>}
								<div className="candidate-list">
									{friendsLoading ? (
										<div className="placeholder-card">Đang tải danh sách bạn bè...</div>
									) : friends.length === 0 ? (
										<div className="placeholder-card">
											<h3>Chưa có bạn bè phù hợp</h3>
											<p>Kết bạn thêm hoặc tìm kiếm tài khoản khác ở trên.</p>
										</div>
									) : (
										<ul>
											{friends.map((friend) => (
													<li key={friend.id}>
														<button
															type="button"
															className={selectedFriendId === friend.id ? "candidate-item selected" : "candidate-item"}
															onClick={() => setSelectedFriendId(friend.id)}
														>
															<div className="avatar">
																<img src={getAvatarUrl(friend.avatar)} alt="" onError={handleAvatarError} />
															</div>
															<div>
																<p className="member-name">{friend.fullname || friend.username || "Unknown"}</p>
																<p className="member-email">{friend.email}</p>
															</div>
														</button>
													</li>
											))}
									</ul>
								)}
								</div>
							</section>
						</div>
						<footer className="modal-footer">
							<div className="selection-hint">
								{selectedAccount ? (
									<span>
										Đang chọn: <strong>{selectedAccount.fullname || selectedAccount.username || "Unknown"}</strong>
										<span className="selection-email">{selectedAccount.email}</span>
									</span>
								) : (
									<span>Chưa chọn thành viên.</span>
								)}
							</div>
							<div className="role-selector">
								<label htmlFor="member-role-select">Role</label>
								<select
									id="member-role-select"
									value={memberRole}
									onChange={(event) => setMemberRole(event.target.value)}
								>
									<option value="view">Viewer</option>
									<option value="edit">Editor</option>
								</select>
							</div>
							<div className="modal-actions">
								<button className="ghost-cta" type="button" onClick={closeAddMemberModal} disabled={addingMember}>
									Cancel
								</button>
								<button
									className="primary-cta"
									type="button"
									onClick={handleAddMember}
									disabled={addingMember || !selectedFriendId}
								>
									{addingMember ? "Adding..." : "Add member"}
								</button>
							</div>
						</footer>
					</div>
				</div>
			)}
		</div>
	);
}

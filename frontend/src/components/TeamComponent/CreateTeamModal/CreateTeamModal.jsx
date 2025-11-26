import { useState } from "react";
import api from "#utils/api.js";
import "./CreateTeamModal.css";

const initialState = {
  name: "",
  error: "",
};

export default function CreateTeamModal({ onClose, onCreated }) {
  const [formState, setFormState] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formState.name.trim()) {
      setFormState((prev) => ({ ...prev, error: "Please enter a team name." }));
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post("/teams/create", {
        name: formState.name.trim(),
      });
      setFormState(initialState);
      onCreated?.();
      onClose();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create team.";
      setFormState((prev) => ({ ...prev, error: message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-team-modal-overlay" role="dialog" aria-modal="true">
      <div className="create-team-modal">
        <div className="modal-header-create-team">
          <h3>Create a new team</h3>
          <button className="icon-button" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body-create-team">
          <label htmlFor="team-name">Team name</label>
          <input
            id="team-name"
            type="text"
            value={formState.name}
            onChange={(event) =>
              setFormState({ ...formState, name: event.target.value, error: "" })
            }
            placeholder="e.g. Product squad"
            disabled={isSubmitting}
          />

          {formState.error && <p className="form-error">{formState.error}</p>}

          <p className="helper-text">
            You will become the leader of this team. You can invite other members after
            creation.
          </p>

          <div className="modal-actions">
            <button type="button" className="ghost-button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

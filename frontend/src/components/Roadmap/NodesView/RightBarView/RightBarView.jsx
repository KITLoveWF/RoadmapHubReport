import TopicRightBar from "../TopicRightBar/TopicRightBar";

export default function RightBarView({ node, onTopicStatusUpdate }) {
    if (node?.type === "topic") {
        return (
            <TopicRightBar
                selectedNode={node}
                onTopicStatusUpdate={onTopicStatusUpdate}
            />
        );
    }
    return null;
}
import { useState, useEffect, useCallback } from "react";
import TopBarView from "#components/Roadmap/TopBarView/TopBarView.jsx"
import { useParams, useLocation } from "react-router-dom";
import {
  ReactFlow,
//   applyNodeChanges,
//   applyEdgeChanges,
//   addEdge,
//   ReactFlowProvider,
//   useReactFlow,
} from '@xyflow/react';
import { Background, BackgroundVariant, Controls, MiniMap } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
//nodes type, edges type
import Topic from '#components/Roadmap/Nodes/Topic/Topic.jsx';
import Title from '#components/Roadmap/Nodes/Title/Title.jsx';
import Button from '#components/Roadmap/Nodes/Button/Button.jsx';
import Section from '#components/Roadmap/Nodes/Section/Section.jsx';
import CheckList from '#components/Roadmap/Nodes/CheckList/CheckList.jsx';
import HorizontalLine from '#components/Roadmap/Nodes/HorizontalLine/HorizontalLine.jsx';
import VerticalLine from '#components/Roadmap/Nodes/VerticalLine/VerticalLine.jsx';
import Paragraph from '#components/Roadmap/Nodes/Paragraph/Paragraph.jsx';
import Edge from '#components/Roadmap/Nodes/Edge/Edge.jsx';
import api from "../../../utils/api";
import RightBarView from "#components/Roadmap/NodesView/RightBarView/RightBarView.jsx";
import RightBarPopUp from "#components/Roadmap/NodesView/RightBarPopUp/RightBarPopUp.jsx"
import {useCheckLogin} from "#hooks/userCheckLogin";
import './RoadmapView.css'; 
//import { set } from "mongoose";

const nodeTypes = {  topic: Topic, title: Title, button: Button, section: Section, checklist: CheckList, horizontalline: HorizontalLine, verticalline: VerticalLine, paragraph: Paragraph };
const edgeTypes = { default :Edge}
export default function RoadmapView(){
    const [nodes, setNodes] = useState([]);
    // 1 cái lưu checklist đang chọn 1 cái lưu checklist cũ để so sánh nếu thay đổi thì mới call api
    const [checkListSelected, setCheckListSelected] = useState(null);
    //const [oldCheckListSelected, setOldCheckListSelected] = useState(null);
    const [edges, setEdges] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const {roadmapId} = useParams();
    const location = useLocation();
    const [roadmapInfo, setRoadmapInfo] = useState(location.state || null);
    const [isMarked, setIsMarked] = useState(Boolean(location.state?.isMarked));
    const [markLoading, setMarkLoading] = useState(false);

    useEffect(() => {
        const fetchAPI = async () => {
            try {
                const res = await api.get(`/roadmaps/view/${roadmapId}`,{
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                })
                const graphPayload = res.data?.roadmap || {};
                const nextNodes = graphPayload.nodes || [];
                setNodes(nextNodes);
                setEdges(graphPayload.edges || []);
                if (graphPayload && Object.keys(graphPayload).length > 0) {
                    setRoadmapInfo((prev) => ({
                        ...prev,
                        ...graphPayload,
                    }));
                }
                setSelectedNode((currentSelected) => {
                    if (!currentSelected) {
                        return currentSelected;
                    }
                    const updatedNode = nextNodes.find((node) => node.id === currentSelected.id);
                    return updatedNode || currentSelected;
                });
            } catch (error) {
                console.error("Không thể tải roadmap", error);
            }
        };

        fetchAPI();
    }, [roadmapId]);
    const changeCheckListSelected = async(node) => {
        const res = await api.post(`checkListAccount/change-item-checklist`,{checkListSelected: node, roadmapId},{withCredentials: true});
        //console.log(res.data);
    }
    useEffect(() => {
        if (location.state) {
            setRoadmapInfo(location.state);
        }
    }, [location.state]);
    useEffect(()=>{
        if(checkListSelected !== null){
            ////console.log("checkListSelected:", checkListSelected?.data?.itemsCheckList);
            changeCheckListSelected(checkListSelected);
        }
        // if(checkListSelected?.data !== oldCheckListSelected?.data){
        //     //console.log("checkListSelected:", checkListSelected?.data?.itemsCheckList);
        //     changeCheckListSelected(checkListSelected);
        //     setOldCheckListSelected(checkListSelected);
        // }
    },[checkListSelected])
    const onNodeClick = useCallback(async (_, node) => {
        if(node.type==="topic"){
            setSelectedNode(node);
            //console.log(node);
        }
        if (node?.type === "button") {
            // Lấy URL từ node data
            const targetUrl = node?.data?.url || node?.data?.link;
            console.log("Target URL:", targetUrl);

            // Nếu là external link (http/https)
            if (targetUrl?.startsWith('http')) {
                window.open(targetUrl, '_blank');
            }
            // Nếu là internal route
            else if (targetUrl) {
                navigate(targetUrl);
            }
        }
        else if(node.type==="checklist"){
            setCheckListSelected(node);
            //await changeCheckListSelected(node);
            ////console.log(node?.data?.itemsCheckList);
        }
    }, [setSelectedNode]);
    const onPaneClick = useCallback(() => {
        setSelectedNode(null);
    });
    const { isLoggedIn, user, loading } = useCheckLogin();
        const handleTopicStatusUpdate = useCallback((nodeId, nextStatus) => {
            setNodes((currentNodes) =>
                currentNodes.map((node) =>
                    node.id === nodeId
                        ? { ...node, data: { ...node.data, topicStatus: nextStatus } }
                        : node
                )
            );
            setSelectedNode((current) => {
                if (!current || current.id !== nodeId) {
                    return current;
                }
                return { ...current, data: { ...current.data, topicStatus: nextStatus } };
            });
        }, []);
    useEffect(() => {
        if (location.state?.isMarked !== undefined) {
            setIsMarked(Boolean(location.state.isMarked));
        }
    }, [location.state]);
    const fetchMarkStatus = useCallback(async (targetId) => {
        try {
            const response = await api.get('/roadmaps/mark');
            const list = response.data?.data ?? [];
            return list.some((item) => item.id === targetId);
        } catch (error) {
            console.error('Không thể tải trạng thái đánh dấu', error);
            return null;
        }
    }, []);
    useEffect(() => {
        if (!roadmapId || !isLoggedIn) {
            return;
        }
        let ignore = false;
        (async () => {
            const status = await fetchMarkStatus(roadmapId);
            if (!ignore && typeof status === 'boolean') {
                setIsMarked(status);
            }
        })();
        return () => {
            ignore = true;
        };
    }, [roadmapId, isLoggedIn, fetchMarkStatus]);
    const deleteRoadmap = () => {
        if (!roadmapInfo?.id || roadmapInfo?.teamId) {
            return;
        }
        return api.post(`/roadmaps/delete`, { id: roadmapInfo.id })
    }
    const handleToggleBookmark = async () => {
        if (!roadmapId || markLoading) {
            return;
        }
        try {
            setMarkLoading(true);
            const response = await api.post(`/roadmaps/mark/${roadmapId}`, { roadmapId });
            const status = response.data?.data?.status;
            if (status === 'marked') {
                setIsMarked(true);
            } else if (status === 'unmarked') {
                setIsMarked(false);
            } else {
                setIsMarked((prev) => !prev);
            }
        } catch (error) {
            console.error('Không thể cập nhật đánh dấu roadmap', error);
        } finally {
            setMarkLoading(false);
        }
    };
    return(
        <div style={{ display: 'flex',width:'100%', height:'100vh', flexDirection: "column", margin: 0}}>
            <TopBarView
                roadmap={roadmapInfo}
                roadmapId={roadmapId}
                user={user}
                deleteRoadmap={deleteRoadmap}
                loading={loading}
                isMarked={isMarked}
                onToggleMark={handleToggleBookmark}
                markLoading={markLoading}
            />
            <div style={{ display: 'flex', width:'100%', flex: 1, minHeight: 0, flexDirection: "row", margin: 0}}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    connectionLineStyle={{ stroke: "#1e90ff", strokeWidth: 2 }}
                    // onNodesChange={onNodesChange}
                    // onEdgesChange={onEdgesChange}
                    // onConnect={onConnect}
                    // onDrop={onDrop}
                    // onDragOver={onDragOver}
                    onNodeClick={onNodeClick}
                    //onEdgeClick={onEdgeClick}
                    onPaneClick={onPaneClick} 
                    // onNodeDrag={onNodeDrag}
                    fitView
                    style={{flex: 1, marginLeft: "0px", paddingRight: "100px", minHeight: 0}}
                    >
                    {/* <Background color="#ccc" variant={BackgroundVariant.Cross} /> */}
                    <Controls showFitView={false} />
                    <MiniMap pannable 
                    style={{ height: 150,  width: 250, bottom: 0, right: 0, margin:0, color:"GrayText"
                        //, right: rightBarOpen,     
                    }} />
                </ReactFlow>
                <RightBarPopUp show={!!selectedNode} onClose={onPaneClick}>
                    {selectedNode && (
                        <RightBarView
                            node={selectedNode}
                            onTopicStatusUpdate={handleTopicStatusUpdate}
                        />
                    )}
                </RightBarPopUp>
            </div>
        </div>
    )
}
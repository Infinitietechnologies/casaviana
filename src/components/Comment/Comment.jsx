import React, { useEffect, useState } from "react";
import { get_comments, create_comment, report_comment } from "@/Api/api";
import { addToast, Button, User, Textarea, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, useDisclosure } from "@heroui/react";
import { useSelector } from "react-redux";
import ReportModal from "../Modals/ReportModal";

const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";

  return Math.floor(seconds) + "s ago";
};

const MoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="5" r="2" fill="currentColor"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
    <circle cx="12" cy="19" r="2" fill="currentColor"/>
  </svg>
);

const FlagIcon = () => (
   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
    <line x1="4" y1="22" x2="4" y2="15"></line>
  </svg>
);

const CollapseIcon = ({ isCollapsed }) => (
  <svg 
    width="12" 
    height="12" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="transition-transform duration-200"
    style={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)' }}
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const CommentItem = ({ 
  comment, 
  isReply = false,
  user,
  replyingTo,
  setReplyingTo,
  replyText,
  setReplyText,
  submitting,
  handleSubmit,
  handleReport
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className={`flex gap-2 ${isReply ? "ml-8 mt-3" : "mb-4"}`}>
      <div className="flex flex-col items-center w-6 flex-shrink-0">
        {/* Collapse/Expand Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-xs hover:opacity-80 transition-opacity relative"
        >
          {isCollapsed ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <CollapseIcon isCollapsed={true} />
            </div>
          ) : (
            (comment.user?.name || "U").charAt(0).toUpperCase()
          )}
        </button>
        
        {/* Vertical Line for nested replies */}
        {!isCollapsed && hasReplies && (
          <div className="w-0.5 flex-1 bg-gray-200 mt-2"></div>
        )}
      </div>

      <div className="flex-grow min-w-0">
        {/* Collapsed View - Only show username and timestamp */}
        {isCollapsed ? (
          <div className="flex items-center gap-2 py-1">
            <span className="font-semibold text-xs text-gray-900">
              {comment.user?.name}
            </span>
            <span className="text-xs text-gray-400">
              • {formatTimeAgo(comment.created_at)}
            </span>
            {hasReplies && (
              <span className="text-xs text-blue-600 font-medium">
                [{comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}]
              </span>
            )}
          </div>
        ) : (
          <>
            {/* Expanded View - Full comment */}
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-xs text-gray-900">
                {comment.user?.name}
              </span>
              <span className="text-xs text-gray-400">
                • {formatTimeAgo(comment.created_at)}
              </span>
            </div>

            <p className="text-sm text-gray-800 mb-2 leading-relaxed">{comment.body}</p>

            <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
              {!isReply && user && (
                <button
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                >
                  Reply
                </button>
              )}

              <Dropdown placement="bottom-start">
                <DropdownTrigger>
                  <button className="hover:bg-gray-100 p-1 rounded transition-colors">
                    <MoreIcon size={16} />
                  </button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Comment actions">
                  <DropdownItem
                    key="report"
                    startContent={<FlagIcon />}
                    onPress={() => handleReport(comment.id)}
                  >
                    Report
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              {hasReplies && (
                <span className="text-gray-400 ml-auto">
                  {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                </span>
              )}
            </div>

            {replyingTo === comment.id && (
              <div className="mt-3 ml-0 border-l-2 border-gray-200 pl-4">
                <Textarea
                  placeholder={`Reply to ${comment.user?.name}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="mb-2"
                  minRows={2}
                  size="sm"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="light"
                    onPress={() => {
                      setReplyingTo(null);
                      setReplyText("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    color="primary"
                    isLoading={submitting}
                    onPress={() => handleSubmit(comment.id, replyText)}
                  >
                    Reply
                  </Button>
                </div>
              </div>
            )}

            {/* Nested Replies */}
            {hasReplies && (
              <div className="mt-3">
                {comment.replies.map(reply => (
                  <CommentItem 
                    key={reply.id} 
                    comment={reply} 
                    isReply={true}
                    user={user}
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                    replyText={replyText}
                    setReplyText={setReplyText}
                    submitting={submitting}
                    handleSubmit={handleSubmit}
                    handleReport={handleReport}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const Comment = ({ slug, resource = "events" }) => {
  const { user } = useSelector((state) => state.auth);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  
  const { 
    isOpen: isReportOpen, 
    onOpen: onReportOpen, 
    onOpenChange: onReportOpenChange 
  } = useDisclosure();
  const [isReporting, setIsReporting] = useState(false);

  const fetchComments = async () => {
    if (!slug) return;
    if (comments.length === 0) {
      setLoading(true);
    }
    
    try {
      const res = await get_comments(resource, slug);
      if (res?.success) {
        if (res.data?.data) {
          setComments(res.data.data);
        } else if (Array.isArray(res.data)) {
          setComments(res.data);
        } else {
          setComments([]);
        }
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [slug]);

  const handleSubmit = async (parentId = null, text) => {
    if (!text.trim()) {
      addToast({ title: "Please enter a comment", color: "danger" });
      return;
    }

    if (!user) {
      addToast({ title: "Please login to comment", color: "warning" });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        body: text,
        parent_id: parentId
      };

      const res = await create_comment(resource, slug, payload);

      if (res?.success) {
        addToast({
          title: res.message || "Comment submitted successfully",
          color: "success",
        });

        if (parentId) {
          setReplyingTo(null);
          setReplyText("");
        } else {
          setNewComment("");
        }
        
        await fetchComments();
      } else {
        addToast({
          title: res?.error || "Failed to submit comment",
          color: "danger",
        });
      }
    } catch (err) {
      addToast({
        title: err?.response?.data?.message || err.message,
        color: "danger",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReport = (commentId) => {
    if (!user) {
      addToast({ title: "Please login to report comments", color: "warning" });
      return;
    }
    setSelectedCommentId(commentId);
    onReportOpen();
  };

  const submitReport = async (reason) => {
    if (!selectedCommentId) return;
    
    setIsReporting(true);
    try {
      const res = await report_comment(selectedCommentId, { reason });
      if (res?.success) {
        addToast({
          title: "Report submitted successfully",
          color: "success",
        });
        onReportOpenChange(false);
      } else {
        addToast({
          title: res?.error || "Failed to submit report",
          color: "danger",
        });
      }
    } catch (err) {
      addToast({
        title: "An error occurred",
        color: "danger",
      });
    } finally {
      setIsReporting(false);
      setSelectedCommentId(null);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-gray-900">
            Comments
          </h3>
          <span className="text-xs text-gray-500">
            ({comments.length})
          </span>
        </div>
      </div>

      <div className="p-4">
        {user ? (
          <div className="mb-6">
            <div className="text-xs text-gray-500 mb-2">
              Comment as <span className="text-blue-600 font-semibold">{user.name}</span>
            </div>
            <Textarea
              placeholder="What are your thoughts?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-2"
              minRows={3}
              classNames={{
                input: "text-sm",
                inputWrapper: "border-gray-300"
              }}
            />
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="light"
                onPress={() => setNewComment("")}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                color="primary"
                isLoading={submitting}
                onPress={() => handleSubmit(null, newComment)}
                isDisabled={!newComment.trim()}
              >
                Comment
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 text-center mb-6 border border-gray-200">
            <p className="text-sm text-gray-600">
              Log in or sign up to leave a comment
            </p>
          </div>
        )}


        <div className="space-y-1">
          {loading ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              Loading comments...
            </div>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <CommentItem 
                key={comment.id} 
                comment={comment}
                user={user}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                replyText={replyText}
                setReplyText={setReplyText}
                submitting={submitting}
                handleSubmit={handleSubmit}
                handleReport={handleReport}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl mb-2">💬</div>
              <p className="text-gray-900 font-medium text-sm">No Comments Yet</p>
              <p className="text-gray-500 text-xs mt-1">
                Be the first to share what you think!
              </p>
            </div>
          )}
        </div>
      </div>
      <ReportModal 
        isOpen={isReportOpen} 
        onOpenChange={onReportOpenChange}
        onSubmit={submitReport}
        isSubmitting={isReporting}
      />
    </div>
  );
};

export default Comment;
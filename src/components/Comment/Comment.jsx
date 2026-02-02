import React, { useEffect, useState } from "react";
import { get_comments, create_comment, report_comment } from "@/Api/api";
import {
  addToast,
  Button,
  User,
  Textarea,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
  Avatar,
} from "@heroui/react";
import { useSelector } from "react-redux";
import ReportModal from "../Modals/ReportModal";
import { useTranslation } from "react-i18next";

const formatTimeAgo = (date, t) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " " + t("comments.time.years");

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " " + t("comments.time.months");

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " " + t("comments.time.days");

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " " + t("comments.time.hours");

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " " + t("comments.time.minutes");

  return Math.floor(seconds) + " " + t("comments.time.seconds");
};

const MoreIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="5" r="2" fill="currentColor" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <circle cx="12" cy="19" r="2" fill="currentColor" />
  </svg>
);

const FlagIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
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
    style={{ transform: isCollapsed ? "rotate(0deg)" : "rotate(90deg)" }}
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const ReplyIcon = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
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
  handleReport,
}) => {
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const hasReplies = comment.replies?.length > 0;

  return (
    <div className={`flex gap-3 ${isReply ? "ml-10 mt-4" : "mb-6"}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Avatar
          src={comment.user?.avatar}
          name={comment.user?.name}
          size="sm"
          classNames={{
            base: "bg-gradient-to-br from-orange-500 to-red-600",
            name: "text-white font-bold text-sm",
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 rounded-xl px-4 py-3">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {comment.user?.name}
              </p>
              <p className="text-xs text-gray-400">
                {formatTimeAgo(comment.created_at, t)}
              </p>
            </div>

            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <button className="p-1 rounded-full hover:bg-gray-200">
                  <MoreIcon />
                </button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  startContent={<FlagIcon />}
                  onPress={() => handleReport(comment.id)}
                >
                  {t("comments.report")}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Body */}
          <p className="text-sm text-gray-800 mt-2">{comment.body}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mt-2 ml-2">
          {!isReply && user && (
            <button
              onClick={() =>
                setReplyingTo(replyingTo === comment.id ? null : comment.id)
              }
              className="flex items-center gap-1 hover:text-blue-600 transition cursor-pointer"
            >
              <ReplyIcon size={14} />
              {t("comments.reply")}
            </button>
          )}

          {hasReplies && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="flex items-center gap-1 hover:text-blue-600"
            >
              <CollapseIcon isCollapsed={isCollapsed} />
              {comment.replies.length} {t("comments.replies")}
            </button>
          )}
        </div>

        {/* Reply box */}
        {replyingTo === comment.id && (
          <div className="mt-3 ml-2">
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              minRows={2}
            />
            <div className="flex gap-2 mt-2">
              <Button
                size="sm"
                variant="light"
                onPress={() => setReplyingTo(null)}
              >
                {t("comments.cancel")}
              </Button>
              <Button
                size="sm"
                color="primary"
                isLoading={submitting}
                onPress={() => handleSubmit(comment.id, replyText)}
              >
                {t("comments.reply")}
              </Button>
            </div>
          </div>
        )}

        {/* Replies */}
        {hasReplies && !isCollapsed && (
          <div className="mt-3 border-l border-gray-200 pl-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                isReply
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
      </div>
    </div>
  );
};

const Comment = ({ slug, resource = "events" }) => {
  const { t } = useTranslation();
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
    onOpenChange: onReportOpenChange,
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
      addToast({ title: t("comments.toasts.empty"), color: "danger" });
      return;
    }

    if (!user) {
      addToast({ title: t("comments.toasts.login_required"), color: "warning" });
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        body: text,
        parent_id: parentId,
      };

      const res = await create_comment(resource, slug, payload);

      if (res?.success) {
        addToast({
          title: res.message || t("comments.toasts.success"),
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
          title: res?.error || t("comments.toasts.error"),
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
      addToast({ title: t("comments.toasts.login_required"), color: "warning" });
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
          title: t("comments.toasts.report_success"),
          color: "success",
        });
        onReportOpenChange(false);
      } else {
        addToast({
          title: res?.error || t("comments.toasts.report_error"),
          color: "danger",
        });
      }
    } catch (err) {
      addToast({
        title: t("comments.toasts.report_error"),
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
          <h3 className="text-sm font-bold text-gray-900">{t("comments.title")}</h3>
          <span className="text-xs text-gray-500">({comments.length})</span>
        </div>
      </div>

      <div className="p-4">
        {user ? (
          <div className="mb-6">
            <div className="text-xs text-gray-500 mb-2">
              {t("comments.comment_as")}{" "}
              <span className="text-blue-600 font-semibold">{user.name}</span>
            </div>
            <Textarea
              placeholder={t("comments.placeholder")}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-2"
              minRows={3}
              classNames={{
                input: "text-sm",
                inputWrapper: "border-gray-300",
              }}
            />
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="light"
                onPress={() => setNewComment("")}
              >
                {t("comments.cancel")}
              </Button>
              <Button
                size="sm"
                color="primary"
                isLoading={submitting}
                onPress={() => handleSubmit(null, newComment)}
                isDisabled={!newComment.trim()}
              >
                {t("comments.submit")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 text-center mb-6 border border-gray-200">
            <p className="text-sm text-gray-600">
              {t("comments.login_to_comment")}
            </p>
          </div>
        )}

        <div className="space-y-1">
          {loading ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              {t("comments.loading")}
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
              <p className="text-gray-900 font-medium text-sm">
                {t("comments.no_comments")}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {t("comments.be_first")}
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

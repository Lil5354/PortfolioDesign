  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(5px)", display: "flex", flexDirection: "column", overflowY: "auto", overflowX: "hidden" }}>
      {/* Nút Đóng (Close) */}
      <button onClick={() => setPage("gallery")} style={{ position: "fixed", top: 20, right: 24, zIndex: 1010, background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: 48, height: 48, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
        <X size={24} />
      </button>

      {/* Nút Prev / Next (Nếu có) */}
      <button style={{ position: "fixed", top: "50%", left: 24, transform: "translateY(-50%)", zIndex: 1010, background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", width: 48, height: 48, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.8)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.5)"}>
        <ChevronLeft size={24} />
      </button>
      <button style={{ position: "fixed", top: "50%", right: 24, transform: "translateY(-50%)", zIndex: 1010, background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", width: 48, height: 48, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.8)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.5)"}>
        <ChevronRight size={24} />
      </button>

      <div style={{ flex: 1, display: "flex", justifyContent: "center", position: "relative", minHeight: "100vh", paddingBottom: 64 }}>
        
        {/* RIGHT SIDEBAR (Sticky) - Nằm bên phải nội dung */}
        <div style={{ position: "absolute", top: 40, left: "50%", transform: "translateX(460px)", zIndex: 1020 }}>
          <div style={{ position: "sticky", top: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            {/* Avatar */}
            <div style={{ position: "relative", cursor: "pointer" }} onClick={() => { const slug = art.user?.portfolioSettings?.portfolioSlug; if (slug) setPage("portfolio", { portfolioSlug: slug }); }}>
              <img src={art.user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80"} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "2px solid #333" }} />
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 14, height: 14, borderRadius: "50%", background: "#0057ff", border: "2px solid #000", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: "bold" }}>+</div>
            </div>

            {/* Like */}
            <button onClick={() => handleLike(art.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: art.likes?.some(l => l.userId === currentUser?.id) ? "#0057ff" : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4, transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = art.likes?.some(l => l.userId === currentUser?.id) ? "#0057ff" : "rgba(255,255,255,0.2)"} onMouseLeave={(e) => e.currentTarget.style.background = art.likes?.some(l => l.userId === currentUser?.id) ? "#0057ff" : "rgba(255,255,255,0.1)"}>
                <ThumbsUp size={20} fill={art.likes?.some(l => l.userId === currentUser?.id) ? "#fff" : "none"} color="#fff" />
              </div>
              <span style={{ fontSize: 12, fontWeight: 500 }}>{art._count?.likes || 0}</span>
            </button>

            {/* Save */}
            <button onClick={() => onBookmarkClick(art.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: isBookmarked ? "#0057ff" : "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4, transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = isBookmarked ? "#0057ff" : "rgba(255,255,255,0.2)"} onMouseLeave={(e) => e.currentTarget.style.background = isBookmarked ? "#0057ff" : "rgba(255,255,255,0.1)"}>
                <Bookmark size={20} fill={isBookmarked ? "#fff" : "none"} color="#fff" />
              </div>
              <span style={{ fontSize: 12, fontWeight: 500 }}>Save</span>
            </button>

            {/* Order (Briefcase) */}
            <button onClick={() => setShowOrderModal(true)} style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4, transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
                <Briefcase size={20} color="#fff" />
              </div>
              <span style={{ fontSize: 12, fontWeight: 500 }}>Hire</span>
            </button>

            {/* Điểm (Points Badge) - Tách ra riêng như yêu cầu */}
            {existingGrade && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "transparent", border: "none", color: "#fff", marginTop: 8 }}>
                <div style={{ width: 48, height: 48, borderRadius: 8, background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4, fontWeight: "bold", fontSize: 18, color: "#fff", boxShadow: "0 4px 12px rgba(34,197,94,0.4)" }}>
                  {existingGrade.score}
                </div>
                <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.8 }}>Score</span>
              </div>
            )}
          </div>
        </div>

        {/* NỘI DUNG CHÍNH (Center) */}
        <div style={{ width: "100%", maxWidth: 860, background: "#fff", margin: "40px 0", borderRadius: 8, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          
          {/* Header trong */}
          <div style={{ padding: "32px 40px" }}>
            <h1 style={{ fontSize: 24, fontWeight: "bold", color: "#191919", margin: "0 0 16px 0" }}>{art.title}</h1>
            <p style={{ fontSize: 15, color: "#696969", lineHeight: 1.6, margin: 0 }}>{art.description}</p>
          </div>

          {/* Các ảnh xếp chồng khít nhau hoặc E-book */}
          <div style={{ display: "flex", flexDirection: "column", width: "100%", background: art.isEbook ? "#F0F2F5" : "transparent" }}>
            {art.isEbook ? (
              <div ref={ebookViewerRef} style={{ width: "100%", padding: "40px 0", display: "flex", justifyContent: "center", position: "relative", background: "#F0F2F5" }}>
                <HTMLFlipBook 
                  width={400} 
                  height={560} 
                  size="stretch"
                  minWidth={315}
                  maxWidth={1000}
                  minHeight={400}
                  maxHeight={1533}
                  maxShadowOpacity={0.5}
                  showCover={true}
                  mobileScrollSupport={true}
                  className="shadow-2xl mx-auto"
                >
                  {allImagesDeduped.map((img, index) => (
                    <div key={index} className="demoPage bg-white overflow-hidden border border-gray-200">
                      <img src={img.imageUrl || img} alt={`Page ${index + 1}`} className="w-full h-full object-contain pointer-events-none" style={{ width: "100%", height: "100%", display: "block" }} />
                    </div>
                  ))}
                </HTMLFlipBook>
                
                {/* Lớp phủ khi hover vào E-book để hiển thị nút Fullscreen */}
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s", background: "rgba(0,0,0,0.2)", pointerEvents: "auto" }}
                     onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                     onMouseLeave={(e) => e.currentTarget.style.opacity = 0}>
                  <button onClick={toggleEbookFullscreen} style={{ background: "rgba(0,0,0,0.7)", color: "#fff", border: "none", borderRadius: 20, padding: "12px 24px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: 600, fontSize: 16 }}>
                    <Maximize2 size={20} /> Xem toàn màn hình
                  </button>
                </div>
              </div>
            ) : (
              allImagesDeduped.map((img, i) => (
                <div key={i} style={{ width: "100%", position: "relative", group: "true" }} onMouseEnter={(e) => {
                  const overlay = e.currentTarget.querySelector('.img-overlay');
                  if(overlay) overlay.style.opacity = 1;
                }} onMouseLeave={(e) => {
                  const overlay = e.currentTarget.querySelector('.img-overlay');
                  if(overlay) overlay.style.opacity = 0;
                }}>
                  <img src={img.imageUrl || img} style={{ width: "100%", display: "block" }} alt="" />
                  
                  {/* Lớp phủ khi hover vào ảnh giống Behance */}
                  <div className="img-overlay" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", opacity: 0, transition: "opacity 0.2s", display: "flex", alignItems: "flex-start", justifyContent: "flex-end", padding: 16 }}>
                    {/* Nút Save trên từng ảnh */}
                    <button onClick={(e) => { e.stopPropagation(); onBookmarkClick(art.id); }} style={{ background: "rgba(0,0,0,0.6)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "8px 16px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontWeight: 600, fontSize: 14 }} onMouseEnter={(e) => e.currentTarget.style.background = "#0057ff"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.6)"}>
                      <Bookmark size={16} fill={isBookmarked ? "#fff" : "none"} /> Save
                    </button>
                    {/* Icon Zoom góc dưới */}
                    <div style={{ position: "absolute", bottom: 20, right: 20, background: "rgba(0,0,0,0.5)", width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                      <Search size={20} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Dưới ảnh: Tag & Tool */}
          <div style={{ padding: "40px", borderBottom: "1px solid #EAEAEA", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: "bold", margin: "0 0 12px 0", color: "#333" }}>Tags</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {art.tags?.map(t => (
                  <span key={t.id} style={{ background: "#F5F5F5", color: "#191919", padding: "6px 12px", borderRadius: 4, fontSize: 13, fontWeight: 500 }}>
                    {t.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: "bold", margin: "0 0 12px 0", color: "#333" }}>Tools</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ background: "#F5F5F5", padding: "6px 12px", borderRadius: 4, fontSize: 13, fontWeight: 500 }}>Figma</span>
                <span style={{ background: "#F5F5F5", padding: "6px 12px", borderRadius: 4, fontSize: 13, fontWeight: 500 }}>Photoshop</span>
              </div>
            </div>
          </div>

          {/* Dưới ảnh: Info Tác giả */}
          <div style={{ padding: "40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <img src={art.user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80"} style={{ width: 80, height: 80, borderRadius: "50%", marginBottom: 16 }} />
            <h2 style={{ fontSize: 20, fontWeight: "bold", margin: "0 0 16px 0", color: "#191919" }}>{art.user?.fullName}</h2>
            <button style={{ background: "#0057ff", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 24, fontSize: 15, fontWeight: "bold", cursor: "pointer", marginBottom: 32 }}>
              Follow
            </button>
            <div style={{ display: "flex", gap: 24, color: "#696969", fontSize: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Eye size={18} /> {art._count?.views || 0} Views</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><ThumbsUp size={18} /> {art._count?.likes || 0} Likes</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><MessageCircle size={18} /> {art.comments?.length || 0} Comments</div>
            </div>
          </div>

          {/* Form Chấm điểm (Nếu là Lecturer) */}
          {["lecturer", "admin"].includes(currentUser?.role) && (
            <div style={{ padding: "0 40px 40px 40px" }}>
              <div style={{ background: "#F9F9F9", border: "1px solid #EAEAEA", borderRadius: 8, padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: "bold", marginBottom: 16, color: "#191919" }}>{existingGrade ? t("updateGrade") : t("gradeThisArtwork")}</h3>
                <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  <input type="number" min="0" max="10" step="0.1" value={scoreInput} onChange={e => setScoreInput(e.target.value)} placeholder={t("scoreLabel")} style={{ width: 100, padding: "10px", borderRadius: 6, border: "1px solid #CCC", outline: "none" }} />
                  <input type="text" value={feedbackInput} onChange={e => setFeedbackInput(e.target.value)} placeholder={t("feedbackOptional")} style={{ flex: 1, padding: "10px", borderRadius: 6, border: "1px solid #CCC", outline: "none" }} />
                </div>
                <button onClick={handleGradeSubmit} style={{ background: "#191919", color: "#fff", border: "none", padding: "10px 24px", borderRadius: 6, fontSize: 14, fontWeight: "bold", cursor: "pointer" }}>
                  {t("submitGrade")}
                </button>
              </div>
            </div>
          )}

          {/* Bình luận */}
          <div style={{ padding: "0 40px 40px 40px" }}>
            <h3 style={{ fontSize: 16, fontWeight: "bold", marginBottom: 16, color: "#191919" }}>Comments ({art.comments?.length || 0})</h3>
            <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
              <img src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&q=80"} style={{ width: 40, height: 40, borderRadius: "50%" }} />
              <div style={{ flex: 1 }}>
                <textarea value={commentInput} onChange={e => setCommentInput(e.target.value)} placeholder="Write a comment..." style={{ width: "100%", padding: "12px", borderRadius: 6, border: "1px solid #CCC", outline: "none", resize: "vertical", minHeight: 80, boxSizing: "border-box" }} />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                  <button onClick={handlePostComment} disabled={postingComment || !commentInput.trim()} style={{ background: "#0057ff", color: "#fff", border: "none", padding: "8px 20px", borderRadius: 20, fontSize: 14, fontWeight: "bold", cursor: "pointer", opacity: commentInput.trim() ? 1 : 0.5 }}>
                    Post
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {art.comments?.map(c => (
                <div key={c.id} style={{ display: "flex", gap: 12 }}>
                  <img src={c.user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&q=80"} style={{ width: 40, height: 40, borderRadius: "50%" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontWeight: "bold", color: "#191919", fontSize: 15 }}>{c.user?.fullName}</span>
                      <span style={{ color: "#999", fontSize: 12 }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p style={{ color: "#333", margin: 0, fontSize: 14, lineHeight: 1.5 }}>{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cột trái rỗng để đẩy nội dung ra giữa cân bằng với sidebar phải */}
        <div style={{ width: 80 }}></div>
      </div>

      {/* Order modal */}
      {showOrderModal && activeArtworkId && (
        <OrderModal setPage={setPage} activeArtworkId={activeArtworkId} onClose={() => setShowOrderModal(false)} />
      )}
    </div>
  );

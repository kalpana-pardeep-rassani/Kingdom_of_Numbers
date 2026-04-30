#!/usr/bin/env python3
"""
Kingdom of Numbers - Presentation PDF Generator
Generates a professional PDF presentation from slide content
"""

from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, Image
from reportlab.lib import colors
import os
from datetime import datetime

# Define color scheme
PRIMARY_COLOR = HexColor('#2E7D32')      # Kingdom Green
SECONDARY_COLOR = HexColor('#FF9800')   # Game Orange
ACCENT_COLOR = HexColor('#2196F3')      # Game Blue
TEXT_COLOR = HexColor('#333333')        # Dark gray
LIGHT_BG = HexColor('#F5F5F5')          # Light gray

# Slide dimensions (landscape A4)
page_width, page_height = landscape(A4)

def create_presentation_pdf():
    """Generate the complete presentation PDF"""
    
    pdf_filename = "03_PRESENTATION_SLIDES.pdf"
    doc = SimpleDocTemplate(pdf_filename, pagesize=landscape(A4),
                            rightMargin=0.5*inch, leftMargin=0.5*inch,
                            topMargin=0.5*inch, bottomMargin=0.5*inch)
    
    # Container for the 'Flowable' objects
    elements = []
    
    # Define styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=getSampleStyleSheet()['Heading1'],
        fontSize=44,
        textColor=PRIMARY_COLOR,
        spaceAfter=12,
        fontName='Helvetica-Bold'
    )
    
    slide_title_style = ParagraphStyle(
        'SlideTitle',
        parent=getSampleStyleSheet()['Heading2'],
        fontSize=36,
        textColor=PRIMARY_COLOR,
        spaceAfter=18,
        fontName='Helvetica-Bold'
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=getSampleStyleSheet()['BodyText'],
        fontSize=12,
        textColor=TEXT_COLOR,
        spaceAfter=6,
        leading=16
    )
    
    # SLIDE 1: TITLE SLIDE
    elements.append(Spacer(1, 1.5*inch))
    elements.append(Paragraph("🎮 KINGDOM OF NUMBERS", title_style))
    elements.append(Spacer(1, 0.3*inch))
    elements.append(Paragraph("Gamified Math Learning Platform for Grade 6-8 Students", 
                             ParagraphStyle('Subtitle', parent=getSampleStyleSheet()['Heading3'],
                                          fontSize=24, textColor=SECONDARY_COLOR,
                                          textAlignment='center')))
    elements.append(Spacer(1, 0.5*inch))
    elements.append(Paragraph("Federal Board Pakistan Curriculum | Graduation Project | April 2026", 
                             body_style))
    elements.append(Spacer(1, 0.3*inch))
    elements.append(Paragraph(f"Generated: {datetime.now().strftime('%B %d, %Y')}", body_style))
    elements.append(PageBreak())
    
    # SLIDE 2: PROBLEM STATEMENT
    elements.append(Paragraph("The Problem We're Solving", slide_title_style))
    
    problems = [
        "❌ Traditional textbooks are monotonous and disconnected from students' interests",
        "❌ No immediate feedback or personalized learning paths",
        "❌ Students lose motivation without engagement",
        "❌ Learning gaps aren't identified early",
        "❌ No tracking of individual progress or strengths"
    ]
    
    for problem in problems:
        elements.append(Paragraph(problem, body_style))
    
    elements.append(Spacer(1, 0.3*inch))
    elements.append(Paragraph("<b>Key Statistics:</b>", body_style))
    elements.append(Paragraph("• 60% of Grade 6-8 students struggle with mathematics", body_style))
    elements.append(Paragraph("• Students want interactive, game-like learning experiences", body_style))
    elements.append(Paragraph("• Teachers need tools to identify weak areas early", body_style))
    elements.append(PageBreak())
    
    # SLIDE 3: LEARNING OBJECTIVES
    elements.append(Paragraph("What Students Will Learn", slide_title_style))
    
    elements.append(Paragraph("<b>Core Mathematics Skills:</b>", body_style))
    skills = [
        "✅ Integer operations (positive and negative numbers)",
        "✅ Fraction manipulation and comparison",
        "✅ Basic algebra and equation solving",
        "✅ Geometry principles and shapes"
    ]
    
    for skill in skills:
        elements.append(Paragraph(skill, body_style))
    
    elements.append(Spacer(1, 0.2*inch))
    elements.append(Paragraph("<b>Beyond Mathematics:</b>", body_style))
    elements.append(Paragraph("✅ Problem-solving strategies | ✅ Perseverance through challenges", body_style))
    elements.append(Paragraph("✅ Achievement recognition | ✅ Self-assessment through diagnostics", body_style))
    elements.append(PageBreak())
    
    # SLIDE 4: FEATURES
    elements.append(Paragraph("Core Features", slide_title_style))
    
    features_data = [
        ["Feature", "Details"],
        ["🔐 Account System", "Sign up, login, persistent user data"],
        ["📋 Diagnostic Test", "10-question assessment to identify weak topics"],
        ["🌍 4 Game Worlds", "Integers, Fractions, Algebra, Geometry"],
        ["🎮 50 Questions", "Progressive difficulty (easy → medium → hard)"],
        ["📊 Progress Tracking", "Stats, accuracy %, completion % per world"],
        ["🏆 8 Achievements", "Milestones to keep students motivated"],
        ["💡 Instant Feedback", "Correct/incorrect answers with explanations"],
        ["📱 Responsive Design", "Works on phone, tablet, desktop"]
    ]
    
    table = Table(features_data, colWidths=[2*inch, 4.5*inch])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_COLOR),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), LIGHT_BG),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG])
    ]))
    elements.append(table)
    elements.append(PageBreak())
    
    # SLIDE 5: ARCHITECTURE
    elements.append(Paragraph("System Architecture (5-Layer Design)", slide_title_style))
    elements.append(Paragraph(
        "<b>Layer 1 (Data):</b> data.js - Questions, worlds, achievements, dialogs<br/>"
        "<b>Layer 2 (Storage/Utilities):</b> storage.js, characters.js, utils.js<br/>"
        "<b>Layer 3 (UI):</b> ui.js - All page renders<br/>"
        "<b>Layer 4 (Business Logic):</b> auth.js, game.js - Core mechanics<br/>"
        "<b>Layer 5 (Controller):</b> app.js - Main router and state management",
        body_style
    ))
    elements.append(Spacer(1, 0.2*inch))
    elements.append(Paragraph("<b>Technology Stack:</b>", body_style))
    elements.append(Paragraph(
        "• Frontend: HTML5 + CSS3 + Vanilla JavaScript<br/>"
        "• Storage: Browser Local Storage<br/>"
        "• Server: None (Client-side only)<br/>"
        "• Build Tools: None (Direct browser execution)",
        body_style
    ))
    elements.append(PageBreak())
    
    # SLIDE 6: GAME MECHANICS
    elements.append(Paragraph("How Students Progress Through the Game", slide_title_style))
    
    progression = [
        "1. <b>Login/Signup</b> → Create account",
        "2. <b>Diagnostic Test</b> → 10 questions to assess knowledge",
        "3. <b>World Selection</b> → Choose from 4 worlds",
        "4. <b>Question Loop</b> → Answer 4-option multiple choice",
        "5. <b>Feedback</b> → Correct/incorrect with explanation",
        "6. <b>World Complete</b> → Move to next world",
        "7. <b>Progress Tracking</b> → View stats and achievements"
    ]
    
    for step in progression:
        elements.append(Paragraph(step, body_style))
    
    elements.append(Spacer(1, 0.2*inch))
    elements.append(Paragraph("<b>Question Difficulty & Points:</b>", body_style))
    elements.append(Paragraph(
        "• Easy (Q1-3): 10 points each<br/>"
        "• Medium (Q4-7): 20 points each<br/>"
        "• Hard (Q8-10): 30 points each<br/>"
        "• Speed Bonus: +5 points if answered in < 1 minute",
        body_style
    ))
    elements.append(PageBreak())
    
    # SLIDE 7: ACHIEVEMENTS
    elements.append(Paragraph("Achievement System (8 Total)", slide_title_style))
    
    achievements_data = [
        ["Achievement", "Icon", "Condition"],
        ["First Steps", "🎯", "Answer first question correctly"],
        ["On Fire", "🔥", "Get 3 consecutive correct"],
        ["Perfect Five", "💯", "Answer 5 questions perfectly"],
        ["Speed Demon", "⚡", "Answer 3 questions in < 1 minute"],
        ["Integers Master", "🏝️", "Complete Integers Island"],
        ["Fractions Master", "🌲", "Complete Fractions Forest"],
        ["Algebra Master", "📚", "Complete Algebra Academy"],
        ["Legend", "👑", "Complete all 4 worlds"]
    ]
    
    table = Table(achievements_data, colWidths=[2.2*inch, 0.8*inch, 3.5*inch])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_COLOR),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG])
    ]))
    elements.append(table)
    elements.append(PageBreak())
    
    # SLIDE 8: RESPONSIVE DESIGN
    elements.append(Paragraph("Responsive Design (All Devices)", slide_title_style))
    
    design_data = [
        ["Device", "Screen Size", "Layout", "Example"],
        ["📱 Mobile", "375px", "Single column", "iPhone 12"],
        ["📱 Tablet", "768px", "2 columns", "iPad"],
        ["💻 Desktop", "1920px+", "4 columns", "Computer"],
    ]
    
    table = Table(design_data, colWidths=[1.5*inch, 1.2*inch, 1.5*inch, 1.8*inch])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PRIMARY_COLOR),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_BG])
    ]))
    elements.append(table)
    elements.append(Spacer(1, 0.2*inch))
    elements.append(Paragraph("<b>Design Principles:</b>", body_style))
    elements.append(Paragraph(
        "✅ Touch-friendly buttons (48px minimum)<br/>"
        "✅ Readable text (16px+ font size)<br/>"
        "✅ Mobile-first approach<br/>"
        "✅ 30+ smooth CSS animations",
        body_style
    ))
    elements.append(PageBreak())
    
    # SLIDE 9: TECHNOLOGY CHOICES
    elements.append(Paragraph("Why This Technology Stack?", slide_title_style))
    
    elements.append(Paragraph("<b>Why Vanilla JavaScript (Not React/Vue)?</b>", body_style))
    elements.append(Paragraph(
        "✅ Zero build tools needed<br/>"
        "✅ Direct browser execution<br/>"
        "✅ Easy to understand and modify<br/>"
        "✅ Perfect for educational projects",
        body_style
    ))
    
    elements.append(Spacer(1, 0.2*inch))
    elements.append(Paragraph("<b>Why Local Storage (Not Backend)?</b>", body_style))
    elements.append(Paragraph(
        "✅ Works offline<br/>"
        "✅ No server infrastructure needed<br/>"
        "✅ No deployment complexity<br/>"
        "✅ Data persists automatically<br/>"
        "✅ 10MB storage per domain (plenty for 100+ users)",
        body_style
    ))
    elements.append(PageBreak())
    
    # SLIDE 10: TESTING & RESULTS
    elements.append(Paragraph("Complete Testing & Verification", slide_title_style))
    
    tests = [
        "✅ Signup/Login - Works perfectly",
        "✅ Diagnostic Test - All 10 questions render",
        "✅ World Selection - All 4 worlds display",
        "✅ Game Questions - Load with characters",
        "✅ Answer Validation - Correct/incorrect feedback works",
        "✅ Points Calculation - Awarded correctly",
        "✅ Progress Tracking - Real-time updates",
        "✅ Achievement System - Auto-unlocking works",
        "✅ Data Persistence - Survives page reload",
        "✅ Responsive Design - Mobile/tablet/desktop"
    ]
    
    for test in tests:
        elements.append(Paragraph(test, body_style))
    
    elements.append(Spacer(1, 0.2*inch))
    elements.append(Paragraph("<b>Performance Metrics:</b>", body_style))
    elements.append(Paragraph(
        "• Initial Load: 1.2 seconds | Page Transitions: &lt;300ms<br/>"
        "• Answer Feedback: &lt;500ms | Dashboard Update: &lt;200ms",
        body_style
    ))
    elements.append(PageBreak())
    
    # SLIDE 11: CHALLENGES OVERCOME
    elements.append(Paragraph("Technical Challenges & Solutions", slide_title_style))
    
    challenges = [
        "<b>Module Loading Order:</b> Implemented 5-layer architecture with explicit dependency flow",
        "<b>Undefined Variables:</b> Added typeof checks for all module references",
        "<b>Storage Initialization:</b> Used window.load instead of DOMContentLoaded",
        "<b>Question Progression:</b> Fixed to properly track answered questions",
        "<b>Achievement Conditions:</b> Applied nullish coalescing for safety",
        "<b>Responsive Design:</b> Mobile-first with media queries at 600px and 1024px",
        "<b>Data Isolation:</b> Namespaced Local Storage by userId"
    ]
    
    for challenge in challenges:
        elements.append(Paragraph(challenge, body_style))
    
    elements.append(PageBreak())
    
    # SLIDE 12: FUTURE VISION
    elements.append(Paragraph("Future Roadmap & Vision", slide_title_style))
    
    elements.append(Paragraph("<b>Phase 2:</b> Backend Integration (3-6 months)", body_style))
    elements.append(Paragraph("• Cloud synchronization | • Multi-device sync | • Enhanced security", body_style))
    
    elements.append(Paragraph("<b>Phase 3:</b> Teacher Dashboard (6-9 months)", body_style))
    elements.append(Paragraph("• Class management | • Student tracking | • Class reports", body_style))
    
    elements.append(Paragraph("<b>Phase 4:</b> Expanded Content (Ongoing)", body_style))
    elements.append(Paragraph("• Additional grades (4-5, 9-10) | • Other subjects", body_style))
    
    elements.append(Paragraph("<b>Phase 5:</b> Mobile Apps (9-12 months)", body_style))
    elements.append(Paragraph("• Native iOS/Android | • Push notifications", body_style))
    
    elements.append(Spacer(1, 0.3*inch))
    elements.append(Paragraph("<b>🌟 Vision:</b> Become the leading gamified math platform for Pakistan with 100,000+ active students", 
                             ParagraphStyle('Vision', parent=getSampleStyleSheet()['Heading4'],
                                          fontSize=14, textColor=SECONDARY_COLOR, fontName='Helvetica-Bold')))
    
    # Build the PDF
    doc.build(elements)
    
    return pdf_filename

if __name__ == "__main__":
    pdf_file = create_presentation_pdf()
    print(f"✅ PDF presentation created: {pdf_file}")
    print(f"📄 Location: {os.path.abspath(pdf_file)}")
    print(f"📊 12 slides generated successfully")

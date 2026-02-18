# Engineering Management Fundamentals
## Top 5 Pillars of Successful Engineering Management

## Executive Summary

This document explores the fundamental pillars of successful engineering management beyond just meeting knowledge and context management. While knowledge management is crucial, effective engineering leadership requires a holistic approach across multiple dimensions.

---

## 1. People Management & Leadership

### 1.1 Why This Matters

Engineering is a people-first discipline. The greatest engineering leader cannot succeed without:
- High-performing, motivated teams
- Strong culture and values
- Effective 1:1s and feedback loops
- Career growth and development

**Quote:** "You manage things, you lead people." - Admiral Grace Hopper

### 1.2 Core Components

#### A. Effective 1:1s
**Purpose:** Build trust, understand blockers, and support growth.

**What Makes a Good 1:1:**
- **Preparation:** Review progress since last meeting, check recent activity
- **Structure:**
  - Personal check-in (how are you?)
  - Progress update (wins, blockers)
  - Feedback (both directions)
  - Growth discussion (goals, skills)
  - Action items (clear, time-bound)
- **Consistency:** Regular cadence, don't cancel unless emergency
- **Follow-through:** Action items are tracked and revisited

**Common Mistakes:**
- Canceling frequently (says you don't value their time)
- Dominating the conversation (should be 50/50 split)
- Only talking about work (ignore personal well-being)
- Not tracking action items (good intentions die without tracking)

#### B. Hiring & Team Building
**Hiring Funnel:**
```
Screening → Technical Assessment → Culture Fit → System Design → Leadership
```

**Key Hiring Metrics:**
- Time-to-hire: <45 days for individual contributors
- Offer acceptance rate: >70%
- Retention after 12 months: >85%
- Diversity goals tracked and improved over time

**Onboarding Best Practices:**
- Day 1: Setup completed (laptop, accounts, access)
- Week 1: First commit merged, understand codebase
- Month 1: Independent on small feature
- Month 3: Full productivity expected
- Assigned buddy/mentor throughout

#### C. Performance Management
**Framework:** Use OKRs for team goals + 360 feedback for individuals.

**Performance Review Cadence:**
- **Monthly:** Quick check-in (15-30 min)
- **Quarterly:** Formal review with ratings (60-90 min)
- **Annually:** Compensation review, promotion discussion

**Rating Scale (5-point):**
1. **Exceeds Expectations:** Consistently exceeds, ready for promotion
2. **Exceeds Expectations:** Often exceeds, strong candidate
3. **Meets Expectations:** Reliable, solid performer (majority should be here)
4. **Needs Improvement:** Struggling, needs support/PIP
5. **Unsatisfactory:** Not meeting minimum standards

**Feedback Best Practices:**
- Be specific (not "you need to be more communicative")
- Be timely (give feedback when event is fresh)
- Be actionable (what should they do differently?)
- Document everything (creates paper trail)

#### D. Culture & Values
**Culture is what happens when you're not in the room.**

**Signs of Healthy Culture:**
- High psychological safety (people speak up, admit mistakes)
- Low blame (post-mortems focus on systems, not individuals)
- Knowledge sharing (code reviews, docs, brown bags)
- Work-life balance respected
- Celebration of wins (team lunches, shoutouts)

**Engineering Manager's Role in Culture:**
- Model the behavior you want to see
- Call out toxic behavior immediately
- Create rituals (retrospectives, demos, social events)
- Protect the team from external noise

### 1.3 Data to Track

| Metric | How to Track | Healthy Range |
|--------|--------------|----------------|
| 1:1 attendance rate | Calendar + notes | >95% |
| Employee satisfaction | Anonymous surveys | NPS >30 |
| Promotion rate | HR data | 10-20% annually |
| Attrition rate | HR data | <15% annually |
| Time-to-productivity | New hire surveys | <90 days |

### 1.4 Common Anti-Patterns

- **The Hero Manager:** Solves all problems personally, doesn't delegate
- **The Absent Manager:** Always in meetings, never available to team
- **The Yes-Man:** Accepts all work from product, overcommits team
- **The Micro-Manager:** Reviews every PR, dictates implementation
- **The Buddy:** Too friendly, can't have difficult conversations

---

## 2. Technical Strategy & Architecture

### 2.1 Why This Matters

Engineering leaders set the technical direction. Without clear technical strategy:
- Teams build the wrong things
- Technical debt accumulates unchecked
- Architecture becomes spaghetti
- Scalability becomes impossible later
- Product innovation suffers

### 2.2 Core Components

#### A. Technical Vision
**Definition:** A 6-18 month view of technical priorities and investments.

**Components of Technical Vision:**
```
1. Current State Assessment
   - Architecture audit
   - Tech debt inventory
   - Team capabilities assessment

2. Future State Goals
   - Scalability targets
   - User experience goals
   - Developer experience goals

3. Gap Analysis
   - What needs to be built?
   - What needs to be refactored?
   - What skills need to be hired?

4. Execution Plan
   - Phased approach
   - Resource allocation
   - Success metrics
```

**Example Technical Vision Statement:**
> "In Q3, we will migrate to a microservices architecture to improve deployment velocity by 50% and reduce team dependencies. This requires hiring 2 infrastructure engineers and dedicating 20% of sprint capacity to migration work."

#### B. Architecture Decisions
**ADR (Architecture Decision Records):**
Standardized format for documenting architectural decisions.

**ADR Template:**
```markdown
# ADR-001: Migrate from Monolith to Microservices

## Status
Accepted

## Context
Our monolith has reached 1M+ lines of code. Deployments take 45+ minutes. Team velocity has slowed 30% over 6 months.

## Decision
Adopt microservices architecture with these boundaries:
- User service (auth, profile)
- Order service (cart, checkout)
- Product service (catalog, search)

## Consequences
### Positive
- Faster deployments (<10 min)
- Independent scaling
- Team autonomy

### Negative
- Increased operational complexity
- Network latency
- Data consistency challenges
```

**Decision Framework:**
- Reversible vs. Irreversible (Reversible decisions are easier)
- 1-way vs. 2-way doors (2-way means you can walk back)
- First-class vs. Second-class optimal (Good enough beats perfect)

#### C. Tech Debt Management
**Definition:** Technical debt is like financial debt - it has interest and must be paid back.

**Types of Tech Debt:**
1. **Deliberate:** Intentionally done to move faster (e.g., "ship this weekend, fix later")
2. **Accidental:** Built by ignorance or oversight (e.g., didn't know best practices)
3. **Bit rot:** Code that was good once but has become outdated

**Management Approach:**
```
Tech Debt Quadrant:
┌─────────────┬─────────────┐
│ Intentional │ Intentional │
│   + High   │   + Low     │
│   Value    │   Value     │
├─────────────┼─────────────┤
│ Accidental  │ Accidental  │
│   + High   │   + Low     │
│   Value    │   Value     │
└─────────────┴─────────────┘

Priority:
1. Pay down high-value debt (clears blockers)
2. Pay down intentional high-value (clears fast, ROI positive)
3. Pay down accidental high-value (fixes mistakes with big impact)
4. Pay down low-value debt only during slow periods
```

**Rule of Thumb:** Allocate 20% of each sprint to tech debt reduction.

#### D. Developer Experience (DX)
**Definition:** How easy and pleasant it is for developers to do their work.

**DX Metrics:**
- Time to first commit for new hire
- Average build time
- Average test time
- Time to deploy
- Debug experience quality

**DX Improvements:**
- Local development environment that "just works"
- Clear documentation (onboarding, architecture, APIs)
- Good tooling (linting, formatting, code generators)
- Fast feedback loops (quick tests, meaningful error messages)
- Self-service infrastructure (devs don't need to wait for ops)

### 2.3 Data to Track

| Metric | How to Track | Healthy Range |
|--------|--------------|----------------|
| Build time | CI/CD metrics | <5 min for 90th percentile |
| Test time | CI/CD metrics | <10 min for 90th percentile |
| Deployment frequency | CI/CD metrics | Daily or weekly |
| Tech debt ratio | Code quality tools | <20% of effort |
| Developer satisfaction | Surveys | DX NPS >30 |

### 2.4 Common Anti-Patterns

- **The Resume-Driven Developer:** Chooses tech stack based on personal interest, not business needs
- **The Premature Optimizer:** Optimizes for scale before having scale problems
- **The Rewrite Champion:** Wants to rewrite everything instead of incremental improvement
- **The Ivory Tower Architect:** Never touches code, dictates unrealistic solutions
- **The Innovation at All Costs:** Always chasing new tech, never delivering value

---

## 3. Project Delivery & Execution

### 3.1 Why This Matters

Engineering leaders are ultimately measured on delivery. Without effective project execution:
- Features ship late or not at all
- Stakeholders lose trust
- Team morale suffers
- Business impact is limited
- You're seen as ineffective

### 3.2 Core Components

#### A. Project Planning & Estimation
**Planning Onion:**
```
┌─────────────────────────────────────┐
│      Annual / Quarterly Goals       │  ← Strategic (OKRs)
├─────────────────────────────────────┤
│         Sprint Planning             │  ← Tactical (2-4 weeks)
├─────────────────────────────────────┤
│         Weekly Execution            │  ← Operational (standups)
└─────────────────────────────────────┘
```

**Estimation Techniques:**
1. **T-Shirt Sizing:** XS, S, M, L, XL (quick, rough)
2. **Story Points:** Fibonacci scale (1, 2, 3, 5, 8, 13, 21) (relative complexity)
3. **Time-Based:** Hours/days (for fixed-scope work)
4. **Planning Poker:** Team consensus approach (reduces bias)

**Estimation Best Practices:**
- Break down large items (anything >5 days needs splitting)
- Include buffer (20-30% for unknowns)
- Track actuals vs. estimates (improves future accuracy)
- Re-estimate when scope changes

#### B. Sprint Management
**Sprint Length:** 2 weeks is standard (short enough for feedback, long enough for meaningful work)

**Sprint Artifacts:**
1. **Sprint Planning:** Choose work, estimate, commit
2. **Daily Standups:** What I did, what I'll do, blockers (15 min max)
3. **Sprint Review/Demo:** Show completed work to stakeholders
4. **Sprint Retro:** What went well, what didn't, improvements

**Velocity Metrics:**
```
Velocity = Story points completed per sprint

Healthy Velocity:
- Stable week-to-week (within ±20%)
- Increasing over time (team gets better)
- Accountable for team size (normalize if team changes)

Anti-patterns:
- Inflating story points to show "higher" velocity
- Not adjusting when team composition changes
- Comparing velocity between teams (different baselines)
```

#### C. Risk Management
**Risk Categories:**
1. **Technical Risk:** Unknown tech, integration complexity
2. **Resource Risk:** Key people unavailable, hiring delays
3. **Timeline Risk:** Dependencies on other teams, external vendors
4. **Scope Risk:** Requirements changing, feature creep

**Risk Register:**
```markdown
| Risk | Probability | Impact | Mitigation | Owner | Status |
|-------|-------------|---------|-------------|--------|--------|
| 3rd party API changes | Medium | High | Build abstraction layer | John | Mitigated |
| Key engineer leaves | Low | Critical | Documentation, cross-training | Maria | Monitoring |
| Scope creep | High | Medium | Change control process | Yugal | Active |
```

**Mitigation Strategies:**
- **Avoid:** Eliminate risk entirely (e.g., choose known tech)
- **Transfer:** Move risk to third party (e.g., use managed service)
- **Mitigate:** Reduce impact or probability (e.g., build fallback)
- **Accept:** Live with risk if low impact (e.g., nice-to-have feature delayed)

#### D. Stakeholder Management
**Stakeholder Types:**
- **Executive:** CTO, VP (care about business outcomes)
- **Product:** PM, Designer (care about features, user value)
- **Business:** Sales, Marketing (care about go-to-market)
- **Operations:** Support, Ops (care about stability)

**Communication Cadence:**
| Stakeholder | Frequency | Format | Content |
|-------------|------------|---------|----------|
| Executive | Monthly | Dashboard | High-level metrics, blockers |
| Product | Weekly | Sync | Progress, timeline updates |
| Team | Daily | Standup | Blockers, progress |
| Cross-team | Bi-weekly | Sync | Dependencies, handoffs |

**Delivering Bad News:**
- Deliver early (don't surprise at deadline)
- Bring solutions, not just problems
- Be data-driven (not "I think", but "metrics show")
- Offer alternatives (Plan A, Plan B, Plan C)

### 3.3 Data to Track

| Metric | How to Track | Healthy Range |
|--------|--------------|----------------|
| Sprint completion rate | Sprint tracking | 80-90% committed completed |
| On-time delivery | Project tracking | >75% of milestones on time |
| Blocked time | Standups | <10% of total time |
| Rework rate | Bug tracking | <15% of work is rework |
| Stakeholder satisfaction | Surveys | NPS >20 |

### 3.4 Common Anti-Patterns

- **The Over-Committer:** Commits team to impossible deadlines
- **The Scope Drifter:** Allows constant scope changes without timeline adjustment
- **The Silent Failure:** Doesn't communicate misses until after deadline
- **The Micro-Project:** Breaks everything into tiny tasks, loses big picture
- **The Hero Delivery:** Pulls all-nighters to meet deadline, creates debt

---

## 4. Processes & Systems

### 4.1 Why This Matters

Good processes amplify team capabilities. Bad processes create bureaucracy and slow down.

**Rule of Thumb:** Processes should serve the team, not the other way around.

### 4.2 Core Components

#### A. Agile Processes
**Scrum vs. Kanban:**
- **Scrum:** Fixed-length sprints, predictable cadence, good for stable teams
- **Kanban:** Continuous flow, flexible, good for support/maintenance

**Ceremonies:**
1. **Standup:** Daily, 15 min, focus on blockers
2. **Planning:** Every 2 weeks, estimate work, commit
3. **Review/Demo:** End of sprint, show work, get feedback
4. **Retro:** End of sprint, improve process

**Retro Formats:**
- **Start/Stop/Continue:** Quick, easy
- **Mad/Sad/Glad:** Emotional perspective
- **4 Ls:** Liked, Learned, Lacked, Longed for
- **Sailboat:** Wind (helping), anchors (dragging), rocks (risks)

#### B. Code Review Process
**Purpose:** Quality control, knowledge sharing, mentorship.

**Review Best Practices:**
- **Responsibility:** At least 1 approval required
- **Turnaround:** <24 hours for small PRs, <48 hours for large
- **Scope:** Keep PRs small (<400 lines) for fast reviews
- **Automation:** Linting, formatting, tests must pass
- **Guidelines:** Clear rubric (what are we looking for?)

**Review Feedback:**
- Be constructive (what to improve, not what's wrong)
- Explain why (helps learning)
- Propose solutions (not just problems)
- Celebrate good code (positive reinforcement)

#### C. Incident Management
**Incident Lifecycle:**
```
Detection → Triage → Mitigation → Resolution → Post-mortem → Prevention
```

**Severity Levels:**
| Severity | Definition | Response Time |
|----------|-------------|---------------|
| SEV-1 | System down, all users affected | <15 min |
| SEV-2 | Degraded, many users affected | <1 hour |
| SEV-3 | Partial outage, some users | <4 hours |
| SEV-4 | Minor issue, few users | <24 hours |
| SEV-5 | Cosmetic, no impact | No urgency |

**Blameless Post-Mortems:**
- Focus on what happened, not who
- Timeline: What, when, who was involved
- Root cause: 5 Whys (ask "why" 5 times)
- Action items: Prevent recurrence

**Example Post-Mortem:**
```markdown
# Incident: Database Outage - 2026-02-15

## Timeline
- 10:00 UTC: Database CPU at 100%
- 10:02 UTC: Alerts fired
- 10:05 UTC: On-call paged
- 10:15 UTC: Emergency scaling applied
- 10:20 UTC: Database recovered

## Root Cause (5 Whys)
1. Why did CPU spike? → Query on unindexed column
2. Why unindexed column? → Index removed during migration
3. Why removed? → Performance test passed without load
4. Why no load test? → Cut corners to ship faster
5. Why cut corners? → No production-like staging environment

## Action Items
1. Add production-like staging environment (Priority: P0, Owner: Infra team)
2. Require load tests for all migrations (Priority: P0, Owner: DB team)
3. Improve monitoring for query performance (Priority: P1, Owner: Observability team)
```

#### D. Release Management
**Release Strategies:**
1. **Blue-Green:** Two environments, switch traffic instantly
2. **Canary:** Gradual rollout (1% → 10% → 50% → 100%)
3. **Feature Flags:** Deploy code, enable per user
4. **Rolling:** Update servers one at a time

**Release Checklist:**
- [ ] Tests passing
- [ ] Documentation updated
- [ ] Rollback plan documented
- [ ] Monitoring in place
- [ ] Stakeholders notified
- [ ] Support team briefed

### 4.3 Data to Track

| Metric | How to Track | Healthy Range |
|--------|--------------|----------------|
| Incident frequency | Incident tracking | <5 SEV-1 per quarter |
| Mean time to resolve (MTTR) | Incident tracking | <4 hours for SEV-1 |
| Mean time to detection (MTTD) | Monitoring | <15 minutes for SEV-1 |
| Code review turnaround | PR metrics | <48 hours for 90th percentile |
| Release success rate | Release tracking | >95% (no rollback)

### 4.4 Common Anti-Patterns

- **The Process Bureaucrat:** Creates process for everything, kills velocity
- **The Cowboy:** No process, chaos, frequent incidents
- **The Meeting Addict:** Every decision needs a meeting
- **The Compliance Overlord:** Focuses on following process over delivering value
- **The Tool Obsessed:** Buys every tool, adoption <10%

---

## 5. Communication & Stakeholder Management

### 5.1 Why This Matters

Engineering is a communication discipline. You can have the best code, best architecture, best team - but if you can't communicate effectively, you will fail.

### 5.2 Core Components

#### A. Writing & Documentation
**Documentation Hierarchy:**
```
┌─────────────────────────────────────┐
│      External Documentation          │  ← APIs, public docs
├─────────────────────────────────────┤
│      Team Documentation            │  ← Architecture, runbooks
├─────────────────────────────────────┤
│      Project Documentation         │  ← PRDs, decisions, specs
└─────────────────────────────────────┘
```

**Documentation Types:**
1. **Onboarding:** How to get started (new hire guide)
2. **Architecture:** High-level design, data flows
3. **APIs:** Endpoints, request/response formats
4. **Runbooks:** How to operate, debug, fix issues
5. **Decisions:** ADRs, meeting notes (why we did what)

**Documentation Best Practices:**
- Keep it up to date (outdated docs are worse than no docs)
- Make it searchable (tags, categories)
- Write for the audience (don't over-explain to seniors, don't under-explain to juniors)
- Use diagrams (visuals beat walls of text)

#### B. Meeting Management
**Effective Meetings:**
- **Purpose:** Clear agenda, expected outcome
- **Attendees:** Right people, not too many
- **Duration:** Short as possible (30 min default)
- **Preparation:** Pre-read materials sent ahead
- **Follow-up:** Action items documented and assigned

**Meeting Types:**
| Type | Purpose | Duration | Output |
|------|---------|----------|---------|
| Daily Standup | Sync blockers | 15 min | Blockers identified |
| 1:1 | Personal connection | 30-60 min | Trust, alignment |
| Planning | Decide work | 60-120 min | Committed scope |
| Retro | Improve process | 60 min | Process changes |
| All-Hands | Team communication | 60 min | Alignment, morale |

**When to Cancel a Meeting:**
- No clear agenda
- Can be resolved async
- Not all attendees needed
- Regular meeting with nothing to discuss

#### C. Presentation Skills
**Presentation Structure:**
```
1. Hook (30 sec): Why should they care?
2. Context (2 min): Background, problem statement
3. Solution (5-10 min): Approach, technical details
4. Impact (2 min): Metrics, benefits
5. Next Steps (1 min): What happens next
```

**Visual Tips:**
- One idea per slide
- Use diagrams over text
- Data可视化 (charts, graphs)
- Big fonts (minimum 24pt)

**Handling Questions:**
- Listen fully before responding
- Acknowledge good questions ("Great question")
- Don't know? Say so, offer to follow up
- Keep answers concise

#### D. Executive Communication
**Executive-Level Communication:**
- **Focus:** Outcomes, not output (not "we deployed 5 PRs" but "we improved latency by 40%")
- **Format:** Exec summary first (TL;DR), details below
- **No Surprises:** Flag risks early, give options

**Executive Summary Template:**
```markdown
## Executive Summary

**Ask:** Approval for microservices migration

**Investment:** $500K (2 engineers, 6 months)

**Benefit:** 50% faster deployments, 30% cost reduction

**Risk:** Low (proven architecture, phased rollout)

**Recommendation:** Approve
```

### 5.3 Data to Track

| Metric | How to Track | Healthy Range |
|--------|--------------|----------------|
| Meeting attendance | Calendar | >90% for required meetings |
| Documentation coverage | Documentation audit | >80% of documented |
| Documentation freshness | Last updated timestamps | <90 days for critical docs |
| Stakeholder satisfaction | Quarterly surveys | NPS >20 |

### 5.4 Common Anti-Patterns

- **The Email Spammer:** Sends everything to everyone, no one reads it
- **The Ghost Communicator:** Never speaks up, disappears in meetings
- **The Technical Jargoneer:** Uses buzzwords, unclear to non-technical
- **The Status Report Zombie:** Sends daily status, no one reads it
- **The Meeting Hog:** Talks entire time, others can't contribute

---

## Integration: How the 5 Pillars Work Together

### The Venn Diagram of Engineering Leadership

```
        People Management
            │
            │    Technical Strategy
            │           │
            │           │
            └─────┬─────┘
                  │
           ┌──────┴──────┐
           │             │
  Project Delivery │ Processes │
           │             │
           └──────┬──────┘
                  │
            Communication
```

**Each pillar supports the others:**
- **People** + **Technical** → Team capability
- **Technical** + **Processes** → System quality
- **Processes** + **Delivery** → Predictable output
- **Delivery** + **Communication** → Stakeholder trust
- **Communication** + **People** → Team culture

### Weekly Rhythm Example

| Day | Focus | Pillar(s) |
|-----|--------|------------|
| Monday | Planning, 1:1s | People, Delivery |
| Tuesday | Deep work, code review | Technical, Processes |
| Wednesday | Standups, progress sync | Delivery, Communication |
| Thursday | Architecture, tech decisions | Technical |
| Friday | Retro, wrap-up | Processes, People |

### Crisis Management: All Pillars Active

When things go wrong:
1. **Communication:** Clear, timely updates
2. **Delivery:** Prioritize critical work
3. **Processes:** Incident management kicks in
4. **Technical:** Root cause analysis
5. **People:** Support affected team members

---

## Self-Assessment: How Are You Doing?

### Scoring (1-5 per question)

#### People Management
- [ ] My direct reports would recommend me as a manager
- [ ] I know what motivates each team member
- [ ] I deliver hard feedback well
- [ ] I advocate for my team's growth
- [ ] Team morale is high

#### Technical Strategy
- [ ] I have a clear 6-18 month technical vision
- [ ] I make good architecture decisions
- [ ] I manage tech debt proactively
- [ ] My team uses good engineering practices
- [ ] Developer experience is strong

#### Project Delivery
- [ ] We ship on time
- [ ] We manage scope effectively
- [ ] We communicate risks early
- [ ] Stakeholders trust our delivery
- [ ] We have predictable velocity

#### Processes
- [ ] Our processes enable, not hinder
- [ ] We have good code review culture
- [ ] We learn from incidents
- [ ] Our releases are smooth
- [ ] Team is happy with processes

#### Communication
- [ ] I communicate clearly and concisely
- [ ] My documentation is useful
- [ ] I run effective meetings
- [ ] Executives trust my updates
- [ ] Stakeholders are aligned

**Scoring:**
- 20-25: Exceptional
- 15-19: Strong
- 10-14: Developing
- 5-9: Needs significant improvement

---

## Recommended Reading

### Books
1. "The Manager's Path" - Camille Fournier
2. "An Elegant Puzzle" - Will Larson
3. "The Phoenix Project" - Gene Kim
4. "High Output Management" - Andy Grove
5. "Crucial Conversations" - Kerry Patterson

### Articles/Blogs
1. "StaffEng" - Will Larson
2. "Engineering Management" - Sarah Mei
3. "Incremental Architecture" - Martin Fowler
4. "Google's Engineering Practices" - Google Research

---

## Summary

The 5 pillars of successful engineering management are:

1. **People Management & Leadership** - Build and empower your team
2. **Technical Strategy & Architecture** - Set clear technical direction
3. **Project Delivery & Execution** - Ship reliably and predictably
4. **Processes & Systems** - Enable the team with good systems
5. **Communication & Stakeholder Management** - Keep everyone aligned

**The Meeting Knowledge Base you're building** fits within pillar 5 (Communication) but also supports:
- Pillar 1 (People) - Track 1:1s, career discussions
- Pillar 2 (Technical) - Document ADRs, architectural decisions
- Pillar 3 (Delivery) - Track decisions, action items
- Pillar 4 (Processes) - Document processes, runbooks

Your tool should be designed as a **force multiplier** across all pillars, not just a meeting notes repository.

---

*Document Version: 1.0*
*Last Updated: February 17, 2026*

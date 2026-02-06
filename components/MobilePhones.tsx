"use client";

import React from 'react'

function MobilePhones() {
  return (
    <>
        <div className="phones">
            {/* LEFT PHONE */}
            <div className="phone left">
                <div className="screen">
                <div className="notch"></div>
                {/* Style must be an object {{ }} */}
                <div className="ui" style={{ background: '#1f78c8', color: '#fff' }}>
                    <h2>TaskMaster</h2>
                    <p style={{ opacity: 0.9, color: 'black' }}>Organize your work</p>
                    
                    <div className="card" style={{ color: 'black' }}>Quick Setup</div>
                    <div className="card" style={{ color: 'black' }}>Daily Goals</div>
                    <div className="card" style={{ color: 'black' }}>Start Now</div>
                    <div className="card" style={{ color: 'black' }}>Participations</div>
                    <div className="card" style={{ color: 'black' }}>Certifications</div>
                    <div className="card" style={{ color: 'black' }}>Code reviews</div>
                    <div className="card" style={{ color: 'black' }}>Design thinking</div>
                </div>
                </div>
            </div>

            {/* <!-- CENTER (ON TOP) --> */}
            <div className="phone center">
                <div className="screen">
                <div className="notch"></div>
                <div className="ui">
                    <div className="header">Today</div>
                    <div className="card">
                    <div className="row"><span>Finish UI</span><span className="badge">2h</span></div>
                    <div className="row"><span>Code Review</span><span className="badge">4</span></div>
                    <div className="row"><span>Workout</span><span className="badge">Done</span></div>
                    </div>
                    <div className="card">
                    <div className="row"><span>Groceries</span><span className="badge">₹</span></div>
                    <div className="row"><span>Read</span><span className="badge">10p</span></div>
                    </div>
                </div>
                </div>
            </div>

            {/* <!-- RIGHT --> */}
            <div className="phone right">
                <div className="screen">
                <div className="notch"></div>
                <div className="ui">
                    <div className="header">Dashboard</div>
                    <div className="card">
                    <div className="row"><span>Completed</span><span className="badge">24</span></div>
                    <div className="row"><span>Streak</span><span className="badge">6d</span></div>
                    <div className="row"><span>Focus</span><span className="badge">78%</span></div>
                    </div>
                    <div className="card">
                    <div className="row"><span>Work</span><span className="badge">8</span></div>
                    <div className="row"><span>Personal</span><span className="badge">5</span></div>
                    </div>
                </div>
                </div>
            </div>

        </div>
        <style jsx>{`
        :root{
            --phone-w: 280px;
            --phone-h: 560px;
            --overlap: 28px; /* ~10% of width */
        }

        body{
            margin:0;
            font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;
            background:transparent;
            display:flex;
            align-items:center;
            justify-content:center;
            height:100vh;
        }

        .phones{
            position:relative;
            width: calc(var(--phone-w) * 3 - var(--overlap) * 2);
            height: var(--phone-h);
        }

        .phone{
            position:absolute;
            top:0;
            width:var(--phone-w);
            height:var(--phone-h);
            border-radius:34px;
            background:#0b0f14;
            padding:14px;
            box-shadow:0 20px 40px rgba(0,0,0,.35);
        }

        .left-phone{
            position:absolute;
            top:0;
            width:240px;
            height:520px;
            border-radius:34px;
            background:#0b0f14;
            padding:14px;
            box-shadow:0 20px 40px rgba(0,0,0,.35);
        }

        .screen{
            width:100%;
            height:100%;
            border-radius:22px;
            background:#f6f8fb;
            position:relative;
            overflow:hidden;
        }

        .notch{
            position:absolute;
            top:8px;
            left:50%;
            transform:translateX(-50%);
            width:140px;
            height:26px;
            background:#000;
            border-radius:0 0 16px 16px;
            z-index:5;
        }

        .phone.left{
            left:0;
            z-index:1;
        }
        .phone.center{
            left: calc(var(--phone-w) - var(--overlap));
            z-index:3;
        }
        .phone.right{
            left: calc(var(--phone-w) * 2 - var(--overlap) * 2);
            z-index:2;
        }

        .phone.left{ transform:scale(.8); }
        .phone.right{ transform:scale(.8); }
        .phone.center{ transform:scale(1.02); }

        .ui{
            padding:48px 16px 16px;
        }

        .header{
            font-weight:700;
            margin-bottom:12px;
        }

        .card{
            background:#fff;
            border-radius:14px;
            padding:12px;
            margin-bottom:10px;
            box-shadow:0 6px 14px rgba(0,0,0,.08);
        }

        .row{
            display:flex;
            justify-content:space-between;
            font-size:13px;
            padding:6px 0;
            border-bottom:1px solid #eee;
        }
        .row:last-child{ border-bottom:none; }

        .badge{
            background:#eef2ff;
            padding:4px 10px;
            border-radius:999px;
            font-size:11px;
        }
      `}</style>
    </>
  )
}

export default MobilePhones
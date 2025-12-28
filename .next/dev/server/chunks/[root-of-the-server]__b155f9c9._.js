module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/mongoose [external] (mongoose, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongoose", () => require("mongoose"));

module.exports = mod;
}),
"[project]/task-manager-project (4)/lib/mongodb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "connectDB",
    ()=>connectDB
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI in environment variables');
}
let cached = {
    conn: null,
    promise: null
};
async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connect(MONGODB_URI, {
            bufferCommands: false
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
}),
"[project]/task-manager-project (4)/models/Task.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const taskSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
    userId: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    priority: {
        type: String,
        enum: [
            'low',
            'medium',
            'high'
        ],
        default: 'medium'
    },
    status: {
        type: String,
        enum: [
            'todo',
            'in-progress',
            'completed'
        ],
        default: 'todo'
    },
    dueDate: {
        type: Date
    },
    category: {
        type: String
    },
    color: {
        type: String,
        default: '#667eea'
    },
    tags: [
        String
    ],
    recurring: {
        enabled: {
            type: Boolean,
            default: false
        },
        frequency: {
            type: String,
            enum: [
                'daily',
                'weekly',
                'monthly'
            ],
            default: 'weekly'
        },
        nextDueDate: {
            type: Date
        }
    },
    subtasks: [
        {
            _id: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
            title: String,
            completed: {
                type: Boolean,
                default: false
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    isTemplate: {
        type: Boolean,
        default: false
    },
    templateName: {
        type: String
    },
    completedAt: {
        type: Date
    },
    estimatedHours: {
        type: Number
    },
    actualHours: {
        type: Number
    },
    attachments: [
        String
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
taskSchema.index({
    userId: 1,
    status: 1
});
taskSchema.index({
    userId: 1,
    priority: 1
});
taskSchema.index({
    userId: 1,
    category: 1
});
taskSchema.index({
    dueDate: 1
});
taskSchema.index({
    userId: 1,
    dueDate: 1
});
taskSchema.index({
    userId: 1,
    isTemplate: 1
});
taskSchema.index({
    userId: 1,
    recurring: 1
});
taskSchema.index({
    createdAt: -1
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Task || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model('Task', taskSchema);
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/task-manager-project (4)/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateToken",
    ()=>generateToken,
    "verifyToken",
    ()=>verifyToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$task$2d$manager$2d$project__$28$4$292f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/task-manager-project (4)/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
;
function verifyToken(req) {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) return null;
    try {
        const decoded = __TURBOPACK__imported__module__$5b$project$5d2f$task$2d$manager$2d$project__$28$4$292f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, process.env.JWT_SECRET || 'secret');
        return decoded.id;
    } catch  {
        return null;
    }
}
function generateToken(userId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$task$2d$manager$2d$project__$28$4$292f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign({
        id: userId
    }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '24h'
    });
}
}),
"[project]/task-manager-project (4)/app/api/analytics/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$task$2d$manager$2d$project__$28$4$292f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/task-manager-project (4)/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$task$2d$manager$2d$project__$28$4$292f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/task-manager-project (4)/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$task$2d$manager$2d$project__$28$4$292f$models$2f$Task$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/task-manager-project (4)/models/Task.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$task$2d$manager$2d$project__$28$4$292f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/task-manager-project (4)/lib/auth.ts [app-route] (ecmascript)");
;
;
;
;
async function GET(req) {
    try {
        const userId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$task$2d$manager$2d$project__$28$4$292f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyToken"])(req);
        if (!userId) return __TURBOPACK__imported__module__$5b$project$5d2f$task$2d$manager$2d$project__$28$4$292f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Unauthorized'
        }, {
            status: 401
        });
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$task$2d$manager$2d$project__$28$4$292f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectDB"])();
        const tasks = await __TURBOPACK__imported__module__$5b$project$5d2f$task$2d$manager$2d$project__$28$4$292f$models$2f$Task$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
            userId,
            isTemplate: false
        });
        const analytics = {
            total: tasks.length,
            completed: tasks.filter((t)=>t.status === 'completed').length,
            inProgress: tasks.filter((t)=>t.status === 'in-progress').length,
            todo: tasks.filter((t)=>t.status === 'todo').length,
            highPriority: tasks.filter((t)=>t.priority === 'high').length,
            mediumPriority: tasks.filter((t)=>t.priority === 'medium').length,
            lowPriority: tasks.filter((t)=>t.priority === 'low').length,
            overdue: tasks.filter((t)=>t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
            completionRate: tasks.length > 0 ? Math.round(tasks.filter((t)=>t.status === 'completed').length / tasks.length * 100) : 0,
            byCategory: {},
            byPriority: {
                high: 0,
                medium: 0,
                low: 0
            },
            byStatus: {
                todo: 0,
                'in-progress': 0,
                completed: 0
            }
        };
        tasks.forEach((task)=>{
            if (task.category) {
                analytics.byCategory[task.category] = (analytics.byCategory[task.category] || 0) + 1;
            }
            analytics.byPriority[task.priority]++;
            analytics.byStatus[task.status]++;
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$task$2d$manager$2d$project__$28$4$292f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(analytics);
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$task$2d$manager$2d$project__$28$4$292f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch analytics'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b155f9c9._.js.map
import { Request, Response, NextFunction } from "express";
import { context, trace } from "@opentelemetry/api";

export function traceLogger(projectId: string) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const span = trace.getSpan(context.active());
    const traceId = span?.spanContext().traceId;

    // NOTE: 動作確認用に自前でトレースIDを生成（あとで本物に差し替える）
    const cloudTraceFormat = traceId
      ? `projects/${projectId}/traces/${traceId}`
      : undefined;

    console.log(
      JSON.stringify({
        message: `Accessing ${req.method} ${req.path}`,
        trace: cloudTraceFormat,
        severity: "INFO",
      })
    );

    next();
  };
}

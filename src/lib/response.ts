import { NextResponse } from "next/server";

export const successResponse = (message: string, data?: any, status = 200) => {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
};

export const errorResponse = (message: string, status = 400, error?: any) => {
  return NextResponse.json(
    {
      success: false,
      message,
      error,
    },
    { status }
  );
};

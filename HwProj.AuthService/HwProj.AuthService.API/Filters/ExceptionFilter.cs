﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;

namespace HwProj.AuthService.API.Filters
{
    public class ExceptionFilter : Attribute, IExceptionFilter
    {
        public void OnException(ExceptionContext exceptionContext)
        {
            var exception = exceptionContext.Exception;
            exceptionContext.Result = new BadRequestObjectResult(exception.Message);
            exceptionContext.ExceptionHandled = true;
        }
    }
}
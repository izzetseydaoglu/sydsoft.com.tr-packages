/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 04:09
 */

import styled from "styled-components";

export const CSS_DataTable = styled.div.attrs((props: { borderSpacing: number }) => props)`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: inherit;
  align-items: inherit;
  overflow: auto;
  border-radius: inherit;
  background-color: #fff;

  .tablebase {
    flex: 1;
    overflow: auto;
  }

  table {
    width: 100%;
    background: #fff;
    border-collapse: collapse;

    thead.sticky {
      position: sticky;
      top: 0;
      z-index: 1;
      border-spacing: 0;
    }

    thead {
      background: #fcfcfc;
      //border-bottom: 1px #3e4d6729 solid;
      text-align: left;
    }

    th.actions {
      width: 0 !important;
      padding: 0 !important;

      &.hide {
        visibility: hidden;
        border-spacing: 0;
        border: none;
      }
    }

    thead > tr {
      position: relative;
    }

    thead > tr:nth-child(1) > th {
      //position: relative;
      border: ${(props: { borderSpacing: number }) => props.borderSpacing}px solid #fff;
      border-bottom: 1px #d7d7d7 solid;
      border-top: none;
      cursor: default;

      &:nth-child(1) {
        text-align: center;
        justify-content: center;

        .title {
          text-align: inherit;
          justify-content: inherit;
        }
      }

      .title {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
        padding: 10px;
        white-space: nowrap;
      }

      &:last-child > .title {
        /*Actions gizli ise son hücreyi, zaten açık ise kendisinin boşluğu var */
        padding-right: 35px;
      }

      &:hover {
        box-shadow: inset 0 -1px 1px 0px #3d89c1;

        [data-sortable=true] {
          .ordericon {
            visibility: visible !important;
          }
        }
      }

      &[data-sortable=true] {
        cursor: pointer;
      }

      .ordericon {
        color: #3d89c1;
        margin-left: 3px;
        font-size: 18px;
      }

      .filtericon {
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translateY(-50%);
        font-size: 18px;
        color: #2e9090;
        cursor: pointer;
        background: #f8f8f9;
        z-index: 1;
      }
    }

    thead > tr:nth-child(2) > th {
      padding: 0;
      border: none;
      text-align: center;
      max-height: 0;
      overflow: hidden;
      transition: all 0.3s ease-in-out;

      .filter {
        visibility: hidden;
        max-height: 0;
      }
    }

    thead > tr.filters_open {
      box-shadow: 0px -2px 20px 6px #dadde1;

      th {
        padding: 3px;
        max-height: 500px;
        transition: all 0.1s ease-in-out;

        .filter {
          max-height: unset;
          visibility: visible;

          .filter-input {
            width: unset;
            max-width: 75%;
            margin: 3px auto;

            .input {
              padding: 3px 10px;
              text-align: center;
              font-weight: normal;
            }

            .input.select {
              padding: 7px 10px;
            }
          }
        }
      }
    }

    tbody > tr {

      position: relative;

      &:hover {
        &[data-onclick=true] {
          td {
            background: #d1ddeb;
          }

          //font-weight: 500;
          text-shadow: 0 0 1px #a3a3a3;
          cursor: pointer;
        }

        &.hasaction {
          //font-weight: 500;
          text-shadow: 0 0 1px #a3a3a3;
        }


        .actions.hide {
          visibility: visible;

          div {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 2px;
            display: flex;
            height: 100%;
            align-items: center;
            background: linear-gradient(269deg, #b1bac5, #cacfd6, #fff);
            padding: 0 10px;
          }
        }
      }

      &:nth-child(even) {
        td {
          background: #f3f3f3;
        }
      }

      &:nth-child(odd) {
        td {
          background: #fff
        }
      }

      & > td {
        border: ${(props: { borderSpacing: number }) => props.borderSpacing}px solid #fff;

        .value {
          //margin: 0 auto;
          padding: 5px 10px;
          text-align: left;
          white-space: nowrap;
        }

        &:nth-child(1) > .value {
          text-align: center;
        }


      }
    }

    .actions {
      position: relative;

      &.hide {
        width: 0;
        padding: 0;
        visibility: hidden;
        border: none;

        div {
          display: none;
        }
      }

      div {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        & > * {
          margin: 0 5px;
        }
      }
    }
  }

  .no-data {
    padding: 50px 10px;
    text-align: center;
    font-size: 20px;
  }

  .pagination {
    position: relative;
    display: flex;
    width: 100%;
    align-items: center;
    background: #fcfcfc;
    color: #2f2f2f;
    border-top: 1px solid rgba(62, 77, 103, 0.16);
    padding: 5px 15px;

    .bilgi {
      flex: 0 0 auto;
      margin: 5px 10px;

      span {
        font-weight: 500
      }
    }

    .sayfala {
      flex: 0 0 auto;
      margin: 5px 10px 5px auto;
      font-family: inherit;
      font-size: inherit;

      span {
        font-weight: 500;
        margin-left: 5px;
      }
    }
  }
`;